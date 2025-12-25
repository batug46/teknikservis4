'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';


export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();


  useEffect(() => {
    setIsMounted(true);

    const handleStorageChange = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      } catch (error) {
        console.error('Sepet verisi okunurken hata:', error);
        setCartCount(0);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/'
      });
      localStorage.removeItem('cart');
      setCartCount(0);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLinkClick = () => {
    closeMenus();
  };

  const isActive = (path) => pathname === path;

  // GÜNCELLENMİŞ Link Stili
  const getLinkClasses = (path) => {
    const active = isActive(path);
    // Arka plan rengini kaldırdık (bg-...)
    const baseClasses = "group px-3 py-2 rounded-lg transition-all duration-200 ease-out relative";

    // Sadece YAZI rengi değişecek, arka plan şeffaf kalacak
    const colorClasses = active
      ? "text-blue-600 dark:text-blue-400 font-bold" // Aktif: Mavi Yazı + Kalın
      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"; // Pasif: Gri Yazı

    return `${baseClasses} ${colorClasses}`;
  };

  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-lg border-b border-gray-200/10">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-xl font-semibold py-4 block text-gray-900">
            Efe Bilgisayar ve Güvenlik Sistemleri
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled
      ? 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800'
      : 'bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm border-b border-transparent'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            Efe Bilgisayar ve Güvenlik Sistemleri
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className={`h-6 w-6 text-gray-700 dark:text-gray-200 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full md:top-auto left-0 md:left-auto w-full md:w-auto mt-0 md:mt-0 z-40 ${isMenuOpen ? 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl p-4' : ''} md:bg-transparent md:border-0 md:shadow-none md:p-0`}>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-1 space-y-2 md:space-y-0 text-sm md:text-base">

              <Link href="/products" onClick={handleLinkClick} className={getLinkClasses('/products')}>
                <span className="relative z-10">Ürünler</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-left transition-transform duration-300 ease-out ${isActive('/products') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>

              <Link href="/book-appointment" onClick={handleLinkClick} className={getLinkClasses('/book-appointment')}>
                <span className="relative z-10">Randevu Al</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-left transition-transform duration-300 ease-out ${isActive('/book-appointment') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>

              <Link href="/contact" onClick={handleLinkClick} className={getLinkClasses('/contact')}>
                <span className="relative z-10">İletişim</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-left transition-transform duration-300 ease-out ${isActive('/contact') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>

              <Link href="/about" onClick={handleLinkClick} className={getLinkClasses('/about')}>
                <span className="relative z-10">Hakkımızda</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-left transition-transform duration-300 ease-out ${isActive('/about') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>

              <Link href="/takip" onClick={handleLinkClick} className={getLinkClasses('/takip')}>
                <span className="relative z-10">Cihaz Takip</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-left transition-transform duration-300 ease-out ${isActive('/takip') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>

              {/* Kullanıcı Menüsü */}
              {status === 'authenticated' && session?.user ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="h-8 w-8 mr-2 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{session.user.name}</span>
                    <svg className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white dark:bg-[#1e293b] shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Hesabım</p>
                      </div>

                      {session.user.role === 'admin' && (
                        <Link href="/admin" onClick={handleLinkClick} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin Paneli
                        </Link>
                      )}
                      <Link href="/messages" onClick={handleLinkClick} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/40 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Mesajlarım
                      </Link>
                      <Link href="/profile" onClick={handleLinkClick} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profilim
                      </Link>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenus();
                        }}
                        className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-4">
                  <Link href="/login" onClick={handleLinkClick} className={getLinkClasses('/login')}>
                    Giriş Yap
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform origin-left transition-transform duration-300 ease-out ${isActive('/login') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </Link>
                  <Link href="/register" onClick={handleLinkClick} className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-500/30">
                    Kayıt Ol
                  </Link>
                </div>
              )}

              <Link href="/cart" onClick={handleLinkClick} className={`ml-4 relative p-2 ${isActive('/cart') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
                {/* Sepet Tooltip */}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Sepet
                </span>
              </Link>

              {/* Controls: Dil Seçici ve Tema */}
              <div className="pl-4 border-l border-gray-200 dark:border-gray-700 h-6 flex items-center gap-3">

                {/* Dil Seçici */}
                {/* Dil Seçici Kaldırıldı */}

                <ThemeToggle />
              </div>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}