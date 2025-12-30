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
    // Rate limiting kontrolü (Test için esnetildi)
    const clientIP = getClientIP(request);
    if (!authRateLimit(clientIP, 5, 60000)) { // 5 şifre sıfırlama/1 dakika
      return NextResponse.json(
        { error: 'Çok fazla şifre sıfırlama denemesi. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gereklidir' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Bu email adresiyle kayıtlı kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Send email with Resend
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://tekniverse.xyz';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Şifre Sıfırlama</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Teknik Servis</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Şifre Sıfırlama Talebi</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Merhaba ${user.name},</h2>
          
          <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              Şifremi Sıfırla
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Bu link güvenlik nedeniyle 1 saat içinde geçerliliğini yitirecektir.</p>
          
          <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px; margin-bottom: 0;">
            Eğer bu şifre sıfırlama talebini siz yapmadıysanız, bu emaili görmezden gelebilirsiniz. Şifreniz değişmeyecektir.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Saygılarımızla,<br>
            <strong>Teknik Servis Ekibi</strong>
          </p>
        </div>
      </body>
      </html>
    `;

    try {
      await resend.emails.send({
        from: 'noreply@tekniverse.xyz', // ✅ Doğrulanmış domain email
        to: email,
        subject: 'Şifre Sıfırlama - Teknik Servis',
        html: emailHtml,
      });

      return NextResponse.json({
        message: 'Şifre sıfırlama linki email adresinize gönderildi'
      });
    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError);

      // Email gönderiminde hata olsa bile token oluşturuldu
      // Kullanıcıya daha genel bir mesaj döndür
      return NextResponse.json({
        message: 'Şifre sıfırlama isteği alındı. Email adresinizi kontrol edin.'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      resendApiKey: process.env.RESEND_API_KEY ? 'Set' : 'Not set'
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
