

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

        // Her bir ayarı tek tek güncelle veya oluştur (Upsert)
        for (const key of keys) {
            const value = body[key];
            if (value !== undefined) { // Boş string olsa bile kaydet, undefined ise geç
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
