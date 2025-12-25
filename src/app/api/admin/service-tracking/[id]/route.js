import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

// PUT: Servis durumunu güncelle
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const id = parseInt(params.id);
        const body = await request.json();
        const { status, diagnosis, description, adminNotes, finalCost, accessories, completedAt, estimatedCost, cancellationReason } = body;

        const updateData = {
            status,
            diagnosis,
            description,
            adminNotes,
            accessories,
            cancellationReason // Artık update edilecek
        };

        if (finalCost !== undefined && finalCost !== "") updateData.finalCost = parseFloat(finalCost);
        if (estimatedCost !== undefined && estimatedCost !== "") updateData.estimatedCost = parseFloat(estimatedCost);
        if (completedAt) updateData.completedAt = new Date(completedAt);

        // KOD ARŞİVLEME LOGİĞİ:
        // Eğer statüs "TESLİM EDİLDİ" (DELIVERED) veya "İPTAL EDİLDİ" (CANCELLED) ise
        // ve kod henüz arşivlenmemişse, kodu boşa çıkar (arşivle).
        // Böylece "TK-123456" tekrar başkasına verilebilir.
        if (status === 'DELIVERED' || status === 'CANCELLED') {
            // Mevcut kaydı çekip kodu kontrol edelim
            const currentRecord = await prisma.serviceTracking.findUnique({
                where: { id },
                select: { trackingCode: true }
            });

            if (currentRecord && !currentRecord.trackingCode.includes('_ARSIV_')) {
                const timestamp = new Date().getTime();
                // Örn: TK-1A2B3C -> TK-1A2B3C_ARSIV_173928372
                updateData.trackingCode = `${currentRecord.trackingCode}_ARSIV_${timestamp}`;
            }
        }

        const updatedRecord = await prisma.serviceTracking.update({
            where: { id },
            data: updateData
        });

        // Decimal alanları güvenli hale getir
        const safeRecord = {
            ...updatedRecord,
            estimatedCost: updatedRecord.estimatedCost ? Number(updatedRecord.estimatedCost) : null,
            finalCost: updatedRecord.finalCost ? Number(updatedRecord.finalCost) : null,
        };

        return NextResponse.json({
            message: 'Kayıt güncellendi.',
            record: safeRecord
        });
    } catch (error) {
        console.error('------- SERVICE UPDATE ERROR START -------');
        console.error('Error Message:', error.message);
        console.error('------- SERVICE UPDATE ERROR END -------');
        return NextResponse.json({ error: 'Güncelleme başarısız.', details: error.message }, { status: 500 });
    }
}

// DELETE: Kaydı sil
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const id = parseInt(params.id);
        await prisma.serviceTracking.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Kayıt silindi.' });
    } catch (error) {
        console.error('Servis silme hatası:', error.message);
        return NextResponse.json({ error: 'Silme başarısız.' }, { status: 500 });
    }
}
