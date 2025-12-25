import prisma from '../lib/prisma';
import MainSlider from '../components/MainSlider';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getSlides() {
    try {
        const slides = await prisma.slider.findMany({
            orderBy: { order: 'asc' },
        });
        return slides;
    } catch (error) {
        console.error('Slider verileri alınırken hata:', error);
        return [];
    }
}

async function getServices() {
    try {
        const services = await prisma.service.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });
        return services;
    } catch (error) {
        console.error('Hizmet verileri alınırken hata:', error);
        return [];
    }
}

// Servis Kartı Bileşeni
function ServiceCard({ title, description, link, imageUrl }) {
    return (
        <div className="relative rounded-xl shadow-lg overflow-hidden group h-64 sm:h-72 lg:h-80 cursor-pointer will-change-transform transition-all duration-200 ease-out hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]">
            {/* Arka Plan Resmi */}
            {imageUrl && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            )}

            {/* Overlay - Yazılar için koyu arka plan */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/85 group-hover:via-black/55 group-hover:to-black/25 transition-all duration-200 ease-out"></div>

            {/* İçerik */}
            <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-5 lg:p-6 transition-transform duration-200 ease-out group-hover:translate-y-[-2px]">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 font-display transition-all duration-200 ease-out group-hover:text-blue-200 leading-tight">{title}</h3>
                <p className="text-gray-200 mb-4 sm:mb-5 lg:mb-6 leading-relaxed transition-all duration-200 ease-out group-hover:text-gray-100 text-sm sm:text-base line-clamp-2 sm:line-clamp-3">{description}</p>
                <div>
                    <Link href={link} className="inline-block px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-150 ease-out shadow-md hover:bg-white/30 hover:border-white/50 hover:shadow-lg hover:scale-105 transform">
                        Detayları Gör
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default async function Home() {
    const slides = await getSlides();
    const services = await getServices();

    return (
        <div className="min-h-screen">
            {/* Hero Section with Tech Background */}
            <div className={`relative overflow-hidden ${slides && slides.length > 0
                ? ''
                : 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
                }`}>
                {/* Animated Background Elements - only show when no slides */}
                {(!slides || slides.length === 0) && (
                    <div className="absolute inset-0">
                        {/* Basit statik gradient - animasyon yok */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10"></div>
                    </div>
                )}

                {slides && slides.length > 0 ? (
                    <div className="relative z-10">
                        <MainSlider slides={slides} />
                    </div>
                ) : (
                    <div className="relative z-10 flex items-center justify-center min-h-screen text-center px-4">
                        <div className="max-w-4xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent font-display leading-tight">
                                Efe Bilgisayar ve Güvenlik Sistemleri
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed font-medium px-4">
                                Teknolojide profesyonel çözümler, güvenilir hizmet
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                                <Link href="/book-appointment" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-colors duration-200 ease-out shadow-lg hover:shadow-xl">
                                    Randevu Al
                                </Link>
                                <Link href="/products" className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-400/50 text-blue-100 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-500/20 backdrop-blur-sm transition-colors duration-200 ease-out">
                                    Ürünleri İncele
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hizmetler Bölümü */}
            <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-900 dark:to-gray-900 relative">
                {/* Temiz arka plan - blob yok */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 px-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent tracking-tight font-display">Hizmetlerimiz</h2>
                        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">Alanında uzman ekibimizle sunduğumuz profesyonel çözümler</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-stretch">
                        {services.length > 0 ? (
                            services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    title={service.title}
                                    description={service.description}
                                    link={service.linkUrl}
                                    imageUrl={service.imageUrl}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">Henüz hizmet eklenmemiş. Admin panelinden hizmet ekleyebilirsiniz.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Bize Ulaşın Bölümü */}
            <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
                {/* Basit arka plan - gereksiz blob'lar kaldırıldı */}
                <div className="container mx-auto px-4 py-16 sm:py-20 text-center relative z-10">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white font-display leading-tight">Hemen Destek Alın</h3>
                    <p className="mt-4 text-base sm:text-lg leading-6 text-blue-100 max-w-2xl mx-auto font-medium px-4">
                        Profesyonel ekibimizle iletişime geçin, teknolojik sorunlarınıza anında çözüm bulalım.
                    </p>
                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-4">
                        <a href="tel:+905555555555" className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm text-sm sm:text-base font-medium rounded-lg text-blue-600 hover:bg-white transition-colors duration-200 ease-out transform hover:scale-105 shadow-lg w-full sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                            Telefonla Ara
                        </a>
                        <a href="mailto:info@teknikservis.com" className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-sm sm:text-base font-medium rounded-lg text-white hover:bg-white/10 backdrop-blur-sm transition-colors duration-200 ease-out w-full sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                            E-posta Gönder
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
