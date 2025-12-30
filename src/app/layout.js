import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from './providers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';

export const metadata = {
  title: 'Efe Bilgisayar ve Güvenlik Sistemleri | Profesyonel Teknik Servis',
  description: 'İstanbul bilgisayar tamiri, güvenlik kamerası kurulumu, alarm sistemleri ve kurumsal teknik servis hizmetleri. Hızlı, güvenilir ve garantili çözümler.',
  keywords: ['bilgisayar tamiri', 'teknik servis', 'güvenlik kamerası', 'alarm sistemleri', 'format atma', 'veri kurtarma', 'notebook tamiri', 'kamera kurulumu', 'istanbul bilgisayarcı'],
  authors: [{ name: 'Efe Bilgisayar' }],
  creator: 'Efe Bilgisayar',
  publisher: 'Efe Bilgisayar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Efe Bilgisayar ve Güvenlik Sistemleri',
    description: 'Profesyonel bilgisayar teknik servisi ve güvenlik sistemleri çözümleri.',
    url: 'https://tekniverse.xyz',
    siteName: 'Efe Bilgisayar',
    locale: 'tr_TR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Sadece production ortamında veya localhost dışındaysak
                  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                    var _log = console.log;
                    var _warn = console.warn;
                    var _error = console.error;
                    
                    // Console metodlarını devre dışı bırak (Veri sızıntısını önlemek için)
                    console.log = function() {};
                    console.debug = function() {};
                    console.info = function() {};
                    // console.warn = function() {}; // Hataları görmek isteyebiliriz
                    
                    // Self-XSS Uyarısı (Orijinal log fonksiyonunu kullanarak)
                    setTimeout(function() {
                      _log('%cDUR!', 'color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0px black;');
                      _log('%cBu alan geliştiriciler içindir. Eğer birisi size buraya bir şey kopyalayıp yapıştırmanızı söylediyse, bu bir dolandırıcılıktır.', 'font-size: 18px; color: #333;');
                      _log('%cBuraya yapıştırılan kodlar hesabınızın çalınmasına neden olabilir!', 'font-size: 18px; font-weight: bold; color: red;');
                    }, 2000);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Providers session={session}>
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
} 