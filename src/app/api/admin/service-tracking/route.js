import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// Rastgele benzersiz takip kodu oluşturur (Örn: TK-1A2B3D)
function generateTrackingCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // I, O, 0, 1 karışıklık olmasın diye çıkarıldı
    let result = 'TK-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// GET: Tüm servis kayıtlarını listeler
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const records = await prisma.serviceTracking.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Decimal alanları numara tipine çevirerek hata almadan gönderiyoruz
        const safeRecords = records.map(record => ({
            ...record,
            estimatedCost: record.estimatedCost ? Number(record.estimatedCost) : null,
            finalCost: record.finalCost ? Number(record.finalCost) : null,
        }));

        return NextResponse.json(safeRecords);
    } catch (error) {
        console.error('------- SERVICE TRACKING ERROR START -------');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        // Prisma hataları bazen meta içinde detay verir
        if (error.meta) console.error('Prisma Meta:', error.meta);
        console.error('------- SERVICE TRACKING ERROR END -------');

        return NextResponse.json({
            error: 'Sunucu hatası.',
            details: error.message, // Geliştirme aşamasında hatayı görelim
            name: error.name
        }, { status: 500 });
    }
}

// POST: Yeni servis kaydı oluşturur
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const body = await request.json();
        const {
            customerName, customerPhone, customerEmail,
            deviceType, brand, model, serialNumber,
            problem, accessories, estimatedCost
        } = body;

        if (!customerName || !customerPhone || !deviceType || !brand || !problem) {
            return NextResponse.json({ error: 'Zorunlu alanları doldurun.' }, { status: 400 });
        }

        // Benzersiz takip kodu oluştur
        let trackingCode;
        let isUnique = false;
        while (!isUnique) {
            trackingCode = generateTrackingCode();
            const existing = await prisma.serviceTracking.findUnique({ where: { trackingCode } });
            if (!existing) isUnique = true;
        }

        const newRecord = await prisma.serviceTracking.create({
            data: {
                trackingCode,
                customerName,
                customerPhone,
                customerEmail,
                deviceType,
                brand,
                model,
                serialNumber,
                problem,
                accessories,
                estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
                status: 'RECEIVED'
            }
        });

        // E-posta Gönderimi (Eğer e-posta adresi varsa)
        if (customerEmail && process.env.RESEND_API_KEY) {
            try {
                const { Resend } = require('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);

                await resend.emails.send({
                    from: 'Teknik Servis <onboarding@resend.dev>',
                    to: customerEmail,
                    subject: `🔧 Servis Kaydınız Alındı: ${trackingCode}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #1e293b;">Servis Kaydınız Oluşturuldu</h2>
                            <p>Sayın <strong>${customerName}</strong>,</p>
                            <p><strong>${brand} ${model}</strong> cihazınız servisimize kabul edilmiştir.</p>
                            
                            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center; border: 1px solid #e2e8f0;">
                                <p style="margin: 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Takip Kodunuz</p>
                                <p style="margin: 8px 0 0 0; font-size: 32px; font-weight: 800; color: #2563eb; letter-spacing: 2px;">${trackingCode}</p>
                            </div>

                            <p>Cihazınızın güncel durumunu aşağıdaki butona tıklayarak veya web sitemizdeki <strong>Cihaz Takip</strong> sayfasından sorgulayabilirsiniz.</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/takip?code=${trackingCode}" 
                                   style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    Arıza Durumunu Sorgula
                                </a>
                            </div>

                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                            
                            <p style="color: #64748b; font-size: 14px;">
                                <strong>Cihaz Bilgileri:</strong><br>
                                Cihaz: ${deviceType} - ${brand} - ${model}<br>
                                Arıza: ${problem}<br>
                                Tahmini Tutar: ${estimatedCost ? estimatedCost + ' ₺' : 'Belirlenmedi'}
                            </p>
                        </div>
                    `
                });
                console.log('Takip kodu emaili gönderildi:', customerEmail);
            } catch (emailError) {
                console.error('Email gönderme hatası:', emailError);
                // Email hatası akışı bozmasın
            }
        }

        return NextResponse.json({
            message: 'Servis kaydı başarıyla oluşturuldu ve bilgilendirme emaili gönderildi.',
            trackingCode: newRecord.trackingCode,
            record: newRecord
        }, { status: 201 });

    } catch (error) {
        console.error('Servis kaydı oluşturulurken hata:', error.message);
        return NextResponse.json({ error: 'Kayıt oluşturulamadı.' }, { status: 500 });
    }
}
