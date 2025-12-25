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

        return NextResponse.json({
            message: 'Servis kaydı başarıyla oluşturuldu.',
            trackingCode: newRecord.trackingCode,
            record: newRecord
        }, { status: 201 });

    } catch (error) {
        console.error('Servis kaydı oluşturulurken hata:', error.message);
        return NextResponse.json({ error: 'Kayıt oluşturulamadı.' }, { status: 500 });
    }
}
