import prisma from './prisma';

export async function getSiteSettings() {
    try {
        const settings = await prisma.siteSettings.findMany();

        // Dizi olan veriyi objeye çeviriyoruz: { key: value }
        const settingsObj = {};
        settings.forEach(item => {
            settingsObj[item.key] = item.value;
        });

        return settingsObj;
    } catch (error) {
        console.error('Site ayarları yüklenirken hata:', error);
        return {};
    }
}
