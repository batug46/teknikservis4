
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

// GET: Kullanıcının servis kayıtlarını listele
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });
        }

        // Kullanıcının güncel bilgilerini (özellikle telefonunu) çek
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        // Eşleşme kriterlerini hazırla: User ID veya Email
        // Telefon numarası GÜVENLİK RİSKİ (geri dönüşüm) nedeniyle kaldırıldı.
        const matchConditions = [
            { userId: parseInt(user.id) },
            { customerEmail: user.email }
        ];

        const services = await prisma.serviceTracking.findMany({
            where: {
                OR: matchConditions
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                trackingCode: true,
                deviceType: true,
                brand: true,
                model: true,
                status: true,
                createdAt: true,
                problem: true,
                finalCost: true,
                estimatedCost: true
            }
        });

        // Decimal safe conversion
        const safeServices = services.map(s => ({
            ...s,
            finalCost: s.finalCost ? Number(s.finalCost) : null,
            estimatedCost: s.estimatedCost ? Number(s.estimatedCost) : null,
        }));

        return NextResponse.json(safeServices);
    } catch (error) {
        console.error('Profil servisleri hatası:', error);
        return NextResponse.json({ error: 'Veriler alınamadı.' }, { status: 500 });
    }
}
