
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET: Tüm ayarları getir (Herkese Açık)
export async function GET(request) {
    try {
        const settings = await prisma.siteSettings.findMany();

        // Array'i Object'e çevir
        const formattedSettings = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(formattedSettings);
    } catch (error) {
        console.error('Genel ayar getirme hatası:', error);
        return NextResponse.json({ error: 'Ayarlar yüklenemedi.' }, { status: 500 });
    }
}
