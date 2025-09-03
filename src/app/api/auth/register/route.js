import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sanitizeInput, validateEmail, validatePasswordStrength, preventSQLInjection } from '../../../../lib/security';
import { authRateLimit, getClientIP } from '../../../../lib/rateLimiter';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Rate limiting kontrolü (Test için esnetildi)
    const clientIP = getClientIP(request);
    if (!authRateLimit(clientIP, 10, 60000)) { // 10 kayıt/1 dakika
      return NextResponse.json(
        { error: 'Çok fazla kayıt denemesi. Lütfen 1 dakika bekleyin.' }, 
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, name, adSoyad, phone } = body;

    // Validate input
    if (!email || !password || !name || !adSoyad) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }

    // Input sanitization
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedAdSoyad = sanitizeInput(adSoyad);
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;

    // Email validation
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }

    // Password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Şifre güvenlik gereksinimlerini karşılamıyor', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // SQL Injection prevention
    try {
      preventSQLInjection(sanitizedEmail);
      preventSQLInjection(sanitizedName);
      preventSQLInjection(sanitizedAdSoyad);
      if (sanitizedPhone) preventSQLInjection(sanitizedPhone);
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz karakterler tespit edildi' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Email doğrulama kontrolü - EmailVerification tablosunda kayıt olmamalı
    // (çünkü doğrulama yapıldıktan sonra silinir)
    const emailVerification = await prisma.emailVerification.findUnique({
      where: { email: sanitizedEmail }
    });

    if (emailVerification) {
      return NextResponse.json(
        { error: 'Email adresinizi önce doğrulamanız gerekiyor. Email kutunuzu kontrol edin.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
        adSoyad: sanitizedAdSoyad,
        phone: sanitizedPhone,
        role: 'user', // Default role
        emailVerified: true, // Email doğrulandı
      },
    });

    // Doğrulama kaydı zaten silinmiş olmalı (verify-email API'sinde)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Kayıt başarılı',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Kayıt işlemi başarısız' },
      { status: 500 }
    );
  }
} 