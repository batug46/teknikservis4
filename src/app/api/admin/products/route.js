import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// GET: Tüm ürünleri listeler
export async function GET(request) {
  try {
    // Admin authentication kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST: Yeni bir ürün veya hizmet oluşturur
export async function POST(request) {
  try {
    // Admin authentication kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }
    const data = await request.json();
    const { name, description, price, originalPrice, imageUrl, category, stock, isActive, specifications, images, soldCount, viewCount } = data;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: 'İsim, fiyat ve kategori zorunludur.' }, { status: 400 });
    }

    // ✅ GÜVENLİK: Input validation ve sanitization
    const sanitizeString = (str, maxLength = 500) => {
      if (typeof str !== 'string') return '';
      return str.trim().slice(0, maxLength);
    };

    const sanitizedName = sanitizeString(name, 200);
    const sanitizedDescription = sanitizeString(description || '', 2000);

    // Numeric validation
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0 || parsedPrice > 999999) {
      return NextResponse.json({ error: 'Geçersiz fiyat değeri.' }, { status: 400 });
    }

    const parsedStock = parseInt(stock) || 0;
    if (parsedStock < 0 || parsedStock > 999999) {
      return NextResponse.json({ error: 'Geçersiz stok değeri.' }, { status: 400 });
    }

    // Category validation
    const validCategories = ['urun', 'hizmet'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Geçersiz kategori.' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: sanitizedName,
        description: sanitizedDescription,
        price: parsedPrice,
        originalPrice: originalPrice ? Math.max(0, parseFloat(originalPrice) || 0) : null,
        imageUrl: sanitizeString(imageUrl || '', 1000),
        category,
        stock: parsedStock,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        specifications: typeof specifications === 'object' ? specifications : {},
        images: Array.isArray(images) ? images.slice(0, 10) : [],
        soldCount: Math.max(0, parseInt(soldCount) || 0),
        viewCount: Math.max(0, parseInt(viewCount) || 0),
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: 'Ürün oluşturulamadı.' }, { status: 500 });
  }
}
