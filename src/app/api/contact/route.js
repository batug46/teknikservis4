import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { rateLimit, getClientIP } from '../../../lib/rateLimiter';

export async function POST(request) {
  try {
    // Rate limiting kontrolü
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 5, 60000)) { // 5 istek/dakika
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen 1 dakika bekleyin.' }, 
        { status: 429 }
      );
    }

    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Tüm zorunlu alanlar doldurulmalıdır.' }, { status: 400 });
    }

    // Input validation
    if (name.length > 100 || email.length > 100 || subject.length > 200 || message.length > 1000) {
      return NextResponse.json({ error: 'Alanlar çok uzun.' }, { status: 400 });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Geçersiz email formatı.' }, { status: 400 });
    }
    
    await prisma.message.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'unread',
      },
    });

    return NextResponse.json({ message: 'Mesaj başarıyla oluşturuldu' }, { status: 201 });
  } catch (error) {
    console.error("İletişim formu API hatası:", error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
