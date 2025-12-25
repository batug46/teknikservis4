import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { rateLimit, getClientIP } from '../../../lib/rateLimiter';

// GET: Takip kodu ile sorgulama
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const email = searchParams.get('email');

        if (!code || !email) {
            return NextResponse.json({ error: 'Takip kodu ve E-posta adresi gereklidir.' }, { status: 400 });
        }

        // Rate Limiting (Kaba kuvvet saldırılarını önlemek için)
        const clientIP = getClientIP(request);
        if (!rateLimit(clientIP, 10, 60000)) { // Dakikada 10 sorgu
            return NextResponse.json({ error: 'Çok fazla sorgu yaptınız. Lütfen bekleyin.' }, { status: 429 });
        }

        // Önce kodu buluyoruz, sonra maili kontrol ediyoruz (Güvenlik katmanı)
        const record = await prisma.serviceTracking.findUnique({
            where: { trackingCode: code },
            select: {
                trackingCode: true,
                customerEmail: true, // Kontrol için çekiyoruz ama aşağıda silebiliriz
                deviceType: true,
                brand: true,
                model: true,
                status: true,
                problem: true,
                diagnosis: true,
                description: true,
                finalCost: true,
                cancellationReason: true, // İptal nedenini de çekmemiz lazım
                createdAt: true,
                updatedAt: true,
                completedAt: true,
            }
        });

        // 1. Kayıt yoksa VEYA
        // 2. Email null ise (eski kayıt) VEYA
        // 3. Email eşleşmiyorsa
        // -> HATA DÖN (Bilgi sızdırma!)
        if (!record || !record.customerEmail || record.customerEmail.toLowerCase() !== email.toLowerCase().trim()) {
            // Güvenlik gereği "Kod doğru ama mail yanlış" dememeliyiz. "Kayıt bulunamadı" demeliyiz ki kodu tahmin edemesinler.
            return NextResponse.json({ error: 'Kayıt bulunamadı veya bilgiler eşleşmiyor.' }, { status: 404 });
        }

        // Güvenlik: customerEmail alanını yanıttan çıkarıyoruz, istemciye gitmesin.
        delete record.customerEmail;

        // Decimal alanları JSON güvenli hale getir
        const safeRecord = {
            ...record,
            estimatedCost: record.estimatedCost ? Number(record.estimatedCost) : null,
            finalCost: record.finalCost ? Number(record.finalCost) : null,
        };

        return NextResponse.json(safeRecord);
    } catch (error) {
        console.error('------- PUBLIC TRACKING API ERROR -------');
        console.error('Message:', error.message);
        console.error('-----------------------------------------');

        return NextResponse.json({
            error: 'Sunucu hatası.',
            // details: error.message // Production'da bu satır kapatılmalı, güvenlik için kapattım.
        }, { status: 500 });
    }
}

// PUT: İptal Talebi
export async function PUT(request) {
    try {
        const body = await request.json();
        const { trackingCode, email, reason } = body;

        if (!trackingCode || !email || !reason) {
            return NextResponse.json({ error: 'Eksik bilgi: Takip kodu, e-posta ve neden gereklidir.' }, { status: 400 });
        }

        const record = await prisma.serviceTracking.findUnique({
            where: { trackingCode }
        });

        // Güvenlik: Kayıt yoksa VEYA e-posta eşleşmiyorsa hata dön.
        if (!record || !record.customerEmail || record.customerEmail.toLowerCase() !== email.toLowerCase().trim()) {
            return NextResponse.json({ error: 'İşlem yetkiniz yok veya kayıt bulunamadı.' }, { status: 404 });
        }

        // İptal edilemeyecek durumlar
        const nonCancellable = ['COMPLETED', 'DELIVERED', 'CANCELLED', 'UNREPAIRABLE', 'READY'];
        if (nonCancellable.includes(record.status)) {
            return NextResponse.json({ error: 'Bu aşamadaki işlem iptal edilemez. Lütfen servisi arayın.' }, { status: 400 });
        }

        // Müşteri iptal talebini iletir -> Durum 'Onay Bekliyor' (PENDING_APPROVAL) olur.
        // Bu sayede arayüzde "İptal Talebi Alındı" gösterebiliriz ve tekrar iptal butonu çıkmaz.
        const newStatus = 'PENDING_APPROVAL';
        const message = 'İptal talebiniz alındı. Admin onayından sonra işlem sonlandırılacaktır.';

        const updated = await prisma.serviceTracking.update({
            where: { trackingCode },
            data: {
                status: newStatus,
                cancellationReason: reason
            }
        });

        return NextResponse.json({ message, status: newStatus });

    } catch (error) {
        console.error('İptal talebi hatası:', error.message);
        return NextResponse.json({ error: 'İşlem başarısız.' }, { status: 500 });
    }
}
