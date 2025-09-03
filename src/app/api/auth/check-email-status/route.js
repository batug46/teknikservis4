import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gerekli' },
        { status: 400 }
      );
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({
        status: 'user_exists',
        message: 'Bu email adresi zaten kayıtlı'
      });
    }

    // Email doğrulama kaydı var mı kontrol et
    const emailVerification = await prisma.emailVerification.findUnique({
      where: { email }
    });

    if (emailVerification) {
      // Token süresi kontrolü
      if (emailVerification.expiresAt < new Date()) {
        // Süresi dolmuş token'ı sil
        await prisma.emailVerification.delete({
          where: { email }
        });
        
        return NextResponse.json({
          status: 'not_verified',
          message: 'Doğrulama süresi dolmuş. Lütfen tekrar doğrulama emaili isteyin'
        });
      }

      return NextResponse.json({
        status: 'pending_verification',
        message: 'Email doğrulama bekleniyor'
      });
    }

    // Email doğrulanmış (EmailVerification tablosunda kayıt yok)
    return NextResponse.json({
      status: 'verified',
      message: 'Email doğrulandı'
    });

  } catch (error) {
    console.error('Email durum kontrolü hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
