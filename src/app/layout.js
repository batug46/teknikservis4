import './globals.css';
import Navbar from '../components/Navbar';
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
        <Providers session={session}>
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow">
            {children}
          </main>
          <footer className="bg-gray-800 dark:bg-gray-950 text-white py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2025 Efe Bilgisayar ve Güvenlik Sistemleri. Tüm hakları saklıdır.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
} 