import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { Resend } from 'resend';
import { authRateLimit, getClientIP } from '../../../../lib/rateLimiter';
import crypto from 'crypto';

// Resend Configuration
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set');
}
const resend = new Resend(process.env.RESEND_API_KEY);

// Email token doğrulama fonksiyonu
async function verifyEmailToken(token) {
  try {
    console.log('Token doğrulama başlatıldı:', token.substring(0, 10) + '...');

    // Token'ı veritabanında bul
    const emailVerification = await prisma.emailVerification.findUnique({
      where: { token }
    });

    console.log('Token bulundu mu:', !!emailVerification);
    if (emailVerification) {
      console.log('Token email:', emailVerification.email);
      console.log('Token süresi:', emailVerification.expiresAt);
    }

    if (!emailVerification) {
      console.log('Token bulunamadı');
      return NextResponse.json(
        { error: 'Geçersiz doğrulama tokenı' },
        { status: 400 }
      );
    }

    // Token süresi kontrolü
    if (emailVerification.expiresAt < new Date()) {
      // Süresi dolmuş token'ı sil
      await prisma.emailVerification.delete({
        where: { token }
      });

      return NextResponse.json(
        { error: 'Doğrulama süresi dolmuş. Lütfen tekrar doğrulama emaili isteyin' },
        { status: 400 }
      );
    }

    // Token'ı sil (tek kullanımlık)
    await prisma.emailVerification.delete({
      where: { token }
    });

    return NextResponse.json({
      message: 'Email başarıyla doğrulandı',
      email: emailVerification.email,
      redirectUrl: `/register?email=${encodeURIComponent(emailVerification.email)}`
    });

  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    return NextResponse.json(
      { error: 'Doğrulama işlemi başarısız' },
      { status: 500 }
    );
  }
}

// Email doğrulama isteği gönder
export async function POST(request) {
  try {
    // Rate limiting kontrolü (Test için esnetildi)
    const clientIP = getClientIP(request);
    if (!authRateLimit(clientIP, 50, 60000)) { // 50 doğrulama/1 dakika (test için esnetildi)
      return NextResponse.json(
        { error: 'Çok fazla doğrulama denemesi. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      );
    }

    const { email, token } = await request.json();

    // Eğer token varsa, email doğrulama işlemi
    if (token) {
      return await verifyEmailToken(token);
    }

    // Eğer email varsa, doğrulama emaili gönder

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // 🔧 FIX: Sadece bu email için mevcut kaydı sil (yeniden gönder durumu için)
    await prisma.emailVerification.deleteMany({
      where: { email }
    });

    // 🧹 CLEANUP: Süresi dolmuş token'ları temizle (tüm emailler için)
    await prisma.emailVerification.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });

    // ❌ REMOVED: Tüm aktif tokenları silme kodu kaldırıldı
    // Bu kod race condition'a sebep oluyordu - diğer kullanıcıların tokenlarını siliyordu

    // Doğrulama token'ı oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 saat (email gecikmelerini kapsamak için)

    // Geçici doğrulama kaydı oluştur
    await prisma.emailVerification.create({
      data: {
        email,
        token: verificationToken,
        expiresAt: tokenExpiry
      }
    });

    // Doğrulama emaili gönder
    try {
      await resend.emails.send({
        from: 'noreply@tekniverse.xyz', // Kendi domain email
        to: email,
        subject: 'Email Doğrulama - Teknik Servis',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Email Doğrulama</h2>
            <p>Merhaba,</p>
            <p>Teknik Servis hesabınızı oluşturmak için email adresinizi doğrulamanız gerekiyor.</p>
            <p>Doğrulama linkine tıklayın:</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://tekniverse.xyz'}/verify-email?token=${verificationToken}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Email Adresimi Doğrula
            </a>
            <p style="margin-top: 20px; color: #666;">
              Bu link 1 saat geçerlidir. Eğer bu işlemi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
            </p>
          </div>
        `
      });

      return NextResponse.json({
        message: 'Doğrulama emaili gönderildi. Lütfen email kutunuzu kontrol edin.'
      });

    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError);

      // Geçici kaydı sil
      await prisma.emailVerification.deleteMany({
        where: { email }
      });

      return NextResponse.json(
        { error: 'Email gönderilemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email doğrulama hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
