import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Public endpoint - Ürün stok bilgilerini döner
 * Sepet sayfası için kullanılır
 */
export async function POST(request) {
    try {
        const { productIds } = await request.json();

        // Input validation
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return NextResponse.json({ error: 'Geçersiz ürün ID listesi.' }, { status: 400 });
        }

        // Max 50 ürün sorgulanabilir (DoS koruması)
        if (productIds.length > 50) {
            return NextResponse.json({ error: 'Maksimum 50 ürün sorgulanabilir.' }, { status: 400 });
        }

        // ID validation
        const validIds = productIds.filter(id => typeof id === 'number' && id > 0);
        if (validIds.length === 0) {
            return NextResponse.json({ error: 'Geçerli ürün ID bulunamadı.' }, { status: 400 });
        }

        // Sadece aktif ürünlerin stok bilgilerini getir
        const products = await prisma.product.findMany({
            where: {
                id: { in: validIds },
                isActive: true
            },
            select: {
                id: true,
                stock: true,
                isActive: true
            }
        });

        // Stok bilgilerini object formatında döndür (cart sayfası bunu bekliyor)
        const stockInfo = {};
        products.forEach(product => {
            stockInfo[product.id] = product.stock;
        });

        const response = NextResponse.json(stockInfo);

        // Cache kontrolü - Stok bilgileri dinamik olduğu için cache'lenmesin
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        response.headers.set('Pragma', 'no-cache');

        return response;
    } catch (error) {
        console.error('Stok bilgisi getirme hatası:', error);
        return NextResponse.json({ error: 'Stok bilgileri alınamadı.' }, { status: 500 });
    }
}
