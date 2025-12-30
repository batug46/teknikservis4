'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        fetch('/api/site-settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Footer settings error:', err));
    }, []);

    // X (Twitter) Logosu
    const XIcon = ({ className }) => (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );

    const socialLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: settings.social_facebook,
            colorClass: 'hover:bg-[#1877F2] hover:text-white dark:hover:bg-[#1877F2] dark:hover:text-white'
        },
        {
            name: 'X (Twitter)',
            icon: XIcon,
            url: settings.social_twitter,
            colorClass: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: settings.social_instagram,
            colorClass: 'hover:bg-[#E4405F] hover:text-white dark:hover:bg-[#E4405F] dark:hover:text-white'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: settings.social_linkedin,
            colorClass: 'hover:bg-[#0A66C2] hover:text-white dark:hover:bg-[#0A66C2] dark:hover:text-white'
        },
        {
            name: 'YouTube',
            icon: Youtube,
            url: settings.social_youtube,
            colorClass: 'hover:bg-[#FF0000] hover:text-white dark:hover:bg-[#FF0000] dark:hover:text-white'
        },
    ].filter(link => link.url); // Sadece dolu olanları göster

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Hakkında */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            TeknikServis
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {settings.footer_about || 'Profesyonel teknik servis hizmetleri'}
                        </p>

                        {/* Sosyal Medya */}
                        {socialLinks.length > 0 && (
                            <div className="flex space-x-3">
                                {socialLinks.map(({ name, icon: Icon, url, colorClass }) => (
                                    <a
                                        key={name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-300 ${colorClass}`}
                                        aria-label={name}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Hızlı Linkler */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Hızlı Linkler
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                    Ürünler
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                    İletişim
                                </Link>
                            </li>
                            <li>
                                <Link href="/book-appointment" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                    Randevu Al
                                </Link>
                            </li>
                            <li>
                                <Link href="/takip" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                    Cihaz Takip
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* İletişim */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            İletişim
                        </h3>
                        <ul className="space-y-3">
                            {settings.contact_phone && (
                                <li className="flex items-start">
                                    <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {settings.contact_phone}
                                    </span>
                                </li>
                            )}
                            {settings.contact_email && (
                                <li className="flex items-start">
                                    <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                    <a href={`mailto:${settings.contact_email}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                        {settings.contact_email}
                                    </a>
                                </li>
                            )}
                            {settings.contact_address && (
                                <li className="flex items-start">
                                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {settings.contact_address}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Çalışma Saatleri */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Çalışma Saatleri
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Hafta İçi:</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {settings.hours_weekday || '09:00 - 18:00'}
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Cumartesi:</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {settings.hours_saturday || '10:00 - 15:00'}
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Pazar:</span>
                                <span className="text-red-600 dark:text-red-500 font-medium">
                                    {settings.hours_sunday || 'Kapalı'}
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Alt Bar - Copyright */}
                <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
                            {settings.footer_copyright || '© 2024 TeknikServis. Tüm hakları saklıdır.'}
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                Gizlilik Politikası
                            </Link>
                            <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                                Kullanım Koşulları
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
