'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail, Phone, MapPin, Send, MessageSquare, Clock,
  Calendar
} from 'lucide-react';


export default function ContactPage() {
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setSettings(data);
      })
      .catch(err => console.error('Ayar yükleme hatası:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simüle edilmiş API isteği
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Form data:', formData);
    alert('İşlem Başarılı (İletişim Demo)');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] text-gray-700 dark:text-gray-300 pb-12 pt-20 md:pt-32 font-sans transition-colors duration-300">

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">İletişim</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-xl font-light leading-relaxed">
          Bizimle iletişime geçin, size yardımcı olalım.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Eşit Genişlikte Grid (Mobilde Tek, Masaüstünde Çift Sütun) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start">

          {/* Sol Sütun: Form */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 md:p-10 shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-800 transition-colors">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 flex items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 mr-3 text-blue-600 dark:text-blue-500" />
              Bize Ulaşın
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Ad Soyad *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={50}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    placeholder="Ad Soyad"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">E-Posta *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={80}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Konu *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  placeholder="Konu"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Mesajınız *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={1000}
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-sm"
                  placeholder="Mesajınız"
                  required
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                >
                  <Send className={`w-5 h-5 mr-2 ${isSubmitting ? 'animate-pulse' : ''}`} />
                  {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
                </button>
              </div>
            </form>
          </div>

          {/* Sağ Sütun: Bilgiler + Saatler + Harita */}
          <div className="space-y-6">

            {/* İletişim Bilgileri */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 md:p-10 shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-800 transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 flex items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 mr-3 text-blue-600 dark:text-blue-500" />
                İletişim Bilgileri
              </h3>
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 dark:bg-[#0F172A] rounded-xl flex items-center justify-center flex-shrink-0 mr-4 md:mr-5 group-hover:bg-blue-100 dark:group-hover:bg-blue-600/20 transition-colors">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Adres</p>
                    <p className="text-gray-900 dark:text-white text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                      {settings.contact_address || "Yükleniyor..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 dark:bg-[#0F172A] rounded-xl flex items-center justify-center flex-shrink-0 mr-4 md:mr-5 group-hover:bg-green-100 dark:group-hover:bg-green-600/20 transition-colors">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Telefon</p>
                    <p className="text-gray-900 dark:text-white text-sm md:text-base font-medium">
                      {settings.contact_phone || "..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 dark:bg-[#0F172A] rounded-xl flex items-center justify-center flex-shrink-0 mr-4 md:mr-5 group-hover:bg-purple-100 dark:group-hover:bg-purple-600/20 transition-colors">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">E-Posta</p>
                    <p className="text-gray-900 dark:text-white text-sm md:text-base font-medium">
                      {settings.contact_email || "..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 md:p-10 shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-800 transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8 flex items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <Clock className="w-5 h-5 md:w-6 md:h-6 mr-3 text-blue-600 dark:text-blue-500" />
                Çalışma Saatleri
              </h3>
              <div className="space-y-4 text-sm md:text-base">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700/50">
                  <span className="text-gray-800 dark:text-white font-medium text-base">Hafta İçi</span>
                  <span className="text-gray-600 dark:text-gray-400 text-base">{settings.hours_weekday || "09:00 - 18:00"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700/50">
                  <span className="text-gray-800 dark:text-white font-medium text-base">Cumartesi</span>
                  <span className="text-gray-600 dark:text-gray-400 text-base">{settings.hours_saturday || "10:00 - 15:00"}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-800 dark:text-white font-medium text-base">Pazar</span>
                  <span className="text-red-600 dark:text-red-500 font-bold text-base">{settings.hours_sunday || "Kapalı"}</span>
                </div>
              </div>

              <div className="mt-8 p-5 bg-gray-50 dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-gray-700 flex items-start">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-500 mr-4 mt-0.5" />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold text-base md:text-lg mb-1">Randevu Alın</h4>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    Sıra beklemeden hizmet almak için online randevu oluşturabilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            {/* HARİTA (Sağ Sütunda, Bilgilerin Altında) */}
            {settings.contact_map_url && (
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-800 p-2 overflow-hidden h-80 md:h-96">
                <iframe
                  src={settings.contact_map_url}
                  className="w-full h-full rounded-xl"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}

          </div>
        </div>

        {/* Hızlı Destek Bant */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-14 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">Hızlı Destek İçin</h2>
            <p className="text-blue-50 mb-8 md:mb-10 max-w-3xl mx-auto font-medium text-base md:text-lg leading-relaxed">
              Acil teknik destek gereksinimi için doğrudan telefon ile iletişime geçebilir veya WhatsApp üzerinden bize ulaşabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <a href={`tel:${settings.contact_phone}`} className="bg-white text-blue-600 hover:bg-gray-50 font-bold py-3 md:py-4 px-8 md:px-10 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl active:scale-[0.98]">
                <Phone className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                Hemen Ara
              </a>
              <a href={`https://wa.me/${settings.contact_phone?.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl active:scale-[0.98]">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                WhatsApp
              </a>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full -ml-20 -mt-20"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-900 opacity-20 rounded-full -mr-20 -mb-20"></div>
        </div>

      </div>

    </div>
  );
}