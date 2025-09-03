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

export async function POST(request) {
  try {
    // Rate limiting kontrolü
    const clientIP = getClientIP(request);
    if (!authRateLimit(clientIP, 3, 300000)) { // 3 doğrulama/5 dakika
      return NextResponse.json(
        { error: 'Çok fazla doğrulama denemesi. Lütfen 5 dakika bekleyin.' }, 
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gerekli' },
        { status: 400 }
      );
    }

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

    // Doğrulama token'ı oluştur
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika

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
        from: 'onboarding@resend.dev', // Geçici email
        to: email,
        subject: 'Email Doğrulama - Teknik Servis',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Email Doğrulama</h2>
            <p>Merhaba,</p>
            <p>Teknik Servis hesabınızı oluşturmak için email adresinizi doğrulamanız gerekiyor.</p>
            <p>Doğrulama linkine tıklayın:</p>
            <a href="https://tekniverse.xyz/verify-email?token=${verificationToken}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Email Adresimi Doğrula
            </a>
            <p style="margin-top: 20px; color: #666;">
              Bu link 15 dakika geçerlidir. Eğer bu işlemi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.
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
