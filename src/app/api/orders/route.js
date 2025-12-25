import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';


export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Bu işlemi yapmak için giriş yapmalısınız.' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!currentUser?.phone || !currentUser?.address) {
      return NextResponse.json({ error: 'Lütfen profilinizdeki telefon ve adres bilgilerinizi tamamlayın.' }, { status: 400 });
    }

    const { cartItems } = await request.json();
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Sepet boş.' }, { status: 400 });
    }

    // Input validation - ID ve quantity kontrolü
    for (const item of cartItems) {
      if (!item.id || typeof item.id !== 'number') {
        return NextResponse.json({ error: 'Geçersiz ürün ID.' }, { status: 400 });
      }
      if (!item.quantity || item.quantity < 1 || item.quantity > 999) {
        return NextResponse.json({ error: 'Geçersiz ürün miktarı.' }, { status: 400 });
      }
    }

    // ✅ GÜVENLİK: DB'den gerçek fiyatları ve ürün bilgilerini çek
    const productIds = cartItems.map(item => item.id);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true // Sadece aktif ürünler
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true
      }
    });

    // Ürün bulunamadı kontrolü
    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({
        error: 'Bazı ürünler bulunamadı veya artık satışta değil.'
      }, { status: 400 });
    }

    // Stok ve fiyat doğrulama
    const stockErrors = [];
    const validatedItems = [];

    for (const cartItem of cartItems) {
      const dbProduct = dbProducts.find(p => p.id === cartItem.id);

      if (!dbProduct) {
        stockErrors.push(`Ürün bulunamadı (ID: ${cartItem.id})`);
        continue;
      }

      if (cartItem.quantity > dbProduct.stock) {
        stockErrors.push(`${dbProduct.name} için yeterli stok yok. Mevcut stok: ${dbProduct.stock}`);
        continue;
      }

      // ✅ GÜVENLİK: DB fiyatını kullan, client'tan gelen fiyatı değil!
      validatedItems.push({
        id: dbProduct.id,
        name: dbProduct.name,
        quantity: cartItem.quantity,
        dbPrice: dbProduct.price, // Gerçek fiyat
        clientPrice: cartItem.price // Karşılaştırma için
      });
    }

    if (stockErrors.length > 0) {
      return NextResponse.json({
        error: 'Stok yetersiz',
        details: stockErrors
      }, { status: 400 });
    }

    // ✅ GÜVENLİK: Toplam fiyatı DB fiyatlarından hesapla
    const totalPrice = validatedItems.reduce((total, item) =>
      total + (item.dbPrice * item.quantity), 0
    );

    const order = await prisma.$transaction(async (tx) => {
      // Siparişi oluştur
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          total: totalPrice,
          phone: currentUser.phone,
          address: currentUser.address,
          status: 'PENDING',
        },
      });

      // Sipariş öğelerini oluştur ve stokları güncelle
      for (const item of validatedItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.dbPrice, // ✅ DB'den gelen gerçek fiyat
          },
        });

        // Stok güncelleme
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    // Email sistemi kaldırıldı - sadece sipariş oluşturuluyor

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}