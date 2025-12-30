

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// ⚡ PRODUCTION FIX: Disable cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Tüm ayarları getir
export async function GET(request) {
    try {
        const settings = await prisma.siteSettings.findMany();

        // Array'i kolay kullanım için Object'e çevir
        // [{key: 'phone', value: '123'}] -> { phone: '123' }
        const formattedSettings = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(formattedSettings);
    } catch (error) {
        console.error('Ayarlar getirme hatası:', error);
        return NextResponse.json({ error: 'Ayarlar yüklenemedi.' }, { status: 500 });
    }
}

// POST: Ayarları güncelle veya oluştur
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        // Sadece Admin yetkisi olanlar değiştirebilir
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const body = await request.json(); // { contact_phone: '...', about_text: '...' }
        const keys = Object.keys(body);

        // Basit Validasyon: Değerlerin çok uzun olmamasını kontrol et
        for (const [key, value] of Object.entries(body)) {
            if (typeof value === 'string' && value.length > 5000) {
                return NextResponse.json({ error: `${key} alanı çok uzun. Maksimum 5000 karakter.` }, { status: 400 });
            }
        }

        // GÜVENLİK VE VALİDASYON KURALLARI
        for (const key of keys) {
            let value = body[key];

            if (typeof value === 'string') {
                value = value.trim();

                // 1. Sosyal Medya ve Link Kontrolleri (Sadece http/https)
                if (key.startsWith('social_') || key.includes('url') || key.includes('link')) {
                    // Boş ise izin ver, dolu ise kontrol et
                    if (value && !value.match(/^https?:\/\//i)) {
                        // Eğer kullanıcı http/https yazmadıysa ve domain girdiyse başına ekle
                        if (value.match(/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)) {
                            value = 'https://' + value;
                        } else {
                            // Geçersiz URL formatı, güvenli değilse kaydetme veya temizle
                            // Ancak kullanıcı deneyimi için boşaltmak yerine javascript: kontrolü yapalım
                            if (value.toLowerCase().includes('javascript:') || value.toLowerCase().includes('data:') || value.toLowerCase().includes('vbscript:')) {
                                continue; // Tehlikeli protokolleri kesinlikle atla
                            }
                        }
                    }
                }

                // 2. Email Kontrolü
                if (key.includes('email')) {
                    // Basit email regex, ve mailto: prefix'i yoksa temizle (API'den ham email beklenir)
                    // XSS payloadlarını temizle
                    value = value.replace(/[<>'"();]/g, '');
                }

                // 3. Telefon Kontrolü (Sadece izin verilen karakterler)
                if (key.includes('phone')) {
                    // Sadece rakam, boşluk, +, -, (, ) karakterlerine izin ver
                    value = value.replace(/[^0-9+\-\s()]/g, '');
                }

                // 4. Genel XSS Temizliği (Tüm string alanlar için)
                // <script>, <iframe>, <object> vb. tehlikeli tagleri temizle
                value = value
                    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                    .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, "")
                    .replace(/on\w+="[^"]*"/g, "") // onclick="..." vb.
                    .replace(/javascript:/gi, "");  // inline javascript
            }

            if (value !== undefined) {
                await prisma.siteSettings.upsert({
                    where: { key: key },
                    update: { value: String(value) },
                    create: { key: key, value: String(value) }
                });
            }
        }

        return NextResponse.json({ message: 'Ayarlar başarıyla güncellendi.' });
    } catch (error) {
        console.error('Ayar güncelleme hatası:', error);
        return NextResponse.json({ error: 'Güncelleme başarısız.' }, { status: 500 });
    }
}
