import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Güvenlik kontrolleri
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get('secret');
    
    // Sadece doğru secret key ile çalışsın
    if (secretKey !== process.env.ADMIN_CREATE_SECRET) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim.' },
        { status: 403 }
      );
    }

    // Zaten admin var mı kontrol et
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin kullanıcısı zaten mevcut.' },
        { status: 400 }
      );
    }

    // Admin bilgileri
    const adminData = {
      email: 'admin@teknikservis.com',
      password: 'admin123', // Bu şifreyi daha güçlü bir şifre ile değiştirmelisiniz
      name: 'Admin',
      adSoyad: 'Admin User',
      role: 'admin',
      phone: '5555555555'
    };

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Önce bu e-posta ile kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanımda.' },
        { status: 400 }
      );
    }

    // Admin kullanıcısını oluştur
    const admin = await prisma.user.create({
      data: {
        ...adminData,
        password: hashedPassword
      }
    });

    // Şifreyi response'dan çıkar
    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      message: 'Admin kullanıcısı başarıyla oluşturuldu.',
      user: adminWithoutPassword
    });

  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Admin kullanıcısı oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 