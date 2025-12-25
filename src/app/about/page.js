'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Clock, Monitor, Laptop, Camera, ShieldCheck,
  CheckCircle, Heart, Globe, Building, ArrowRight, Zap, Target, Star, Award
} from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setSettings(data);
      })
      .catch(err => console.error(err));
  }, []);

  const services = [
    { title: settings.service_1_title, desc: settings.service_1_desc, icon: Laptop },
    { title: settings.service_2_title, desc: settings.service_2_desc, icon: Camera },
    { title: settings.service_3_title, desc: settings.service_3_desc, icon: ShieldCheck },
    { title: settings.service_4_title, desc: settings.service_4_desc, icon: Monitor },
  ];

  const advantages = [
    { title: settings.advantage_1_title, desc: settings.advantage_1_desc, icon: Clock, color: "text-blue-500" },
    { title: settings.advantage_2_title, desc: settings.advantage_2_desc, icon: Users, color: "text-green-500" },
    { title: settings.advantage_3_title, desc: settings.advantage_3_desc, icon: Award, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-300 font-sans">

      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-[#1e3a8a] to-[#0B1120] pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden text-center">
        {/* Arka plan daireleri */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-32 h-32 bg-purple-600 rounded-full opacity-10 blur-xl"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-8 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-900/50">
            <Building className="w-8 h-8 text-blue-300" />
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Efe Bilgisayar ve <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
              Güvenlik Sistemleri
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto font-light">
            2010 yılından bu yana teknoloji dünyasında güvenilir çözümler sunuyoruz.
          </p>

          {/* Hero Altı İkonlar Şeridi */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 md:gap-16 border-t border-white/10 pt-10 px-4">
            <div className="flex items-center justify-center sm:justify-start">
              <Heart className="w-5 h-5 text-blue-400 mr-3" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">{settings.hero_card_1_title || "Güvenilir Hizmet"}</div>
                <div className="text-xs text-gray-400">{settings.hero_card_1_desc || "13 yıllık tecrübe"}</div>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <Globe className="w-5 h-5 text-blue-400 mr-3" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">{settings.hero_card_2_title || "Geniş Hizmet Ağı"}</div>
                <div className="text-xs text-gray-400">{settings.hero_card_2_desc || "Ankara genelinde"}</div>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <Shield className="w-5 h-5 text-blue-400 mr-3" />
              <div className="text-left">
                <div className="text-white font-bold text-sm">{settings.hero_card_3_title || "Kalite Garantisi"}</div>
                <div className="text-xs text-gray-400">{settings.hero_card_3_desc || "%100 müşteri memnuniyeti"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Orta Bölüm: Hakkımızda & Hizmetler Kartı */}
      <section className="py-12 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">

            {/* Sol: Metin */}
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-800">
                Hakkımızda
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                {settings.about_title || "Teknolojide Güvenilir Ortağınız"}
              </h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line mb-8 text-base md:text-lg">
                {settings.about_content || "..."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <div className="flex items-center bg-[#1E293B] p-4 rounded-xl border border-gray-800 min-w-[200px]">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-4">
                    <Star className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Müşteri Memnuniyeti</div>
                    <div className="text-xs text-gray-400">%98 memnuniyet oranı</div>
                  </div>
                </div>
                <div className="flex items-center bg-[#1E293B] p-4 rounded-xl border border-gray-800 min-w-[200px]">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mr-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Hızlı Çözüm</div>
                    <div className="text-xs text-gray-400">24 saat içinde yanıt</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Hizmetlerimiz Kartı (Gradient) */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

              <h3 className="text-2xl font-bold mb-8">Hizmetlerimiz</h3>
              <div className="space-y-6">
                {services.map((service, idx) => {
                  const Icon = service.icon;
                  let title = service.title || "Hizmet";
                  let desc = service.desc || "Hizmet açıklaması";

                  return (
                    <div key={idx} className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mr-4 flex-shrink-0 backdrop-blur-sm">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base md:text-lg mb-1">{title}</h4>
                        <p className="text-blue-100 text-sm opacity-80 leading-snug">{desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Neden Bizi Tercih Etmelisiniz (Koyu Gri Şerit) */}
      <section className="py-16 md:py-24 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-800">
              Avantajlarımız
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Sektörde edindiğimiz deneyim ve uzman ekibimizle size en iyi hizmeti sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div key={idx} className="bg-[#1F2937] p-6 md:p-8 rounded-2xl border border-gray-800 text-center hover:border-blue-500/30 transition-colors group">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-[#374151] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className={`w-7 h-7 md:w-8 md:h-8 ${adv.color}`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">{adv.title || "..."}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {adv.desc || "..."}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Misyon & Vizyon (Görseldeki Renkli Kartlar) */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-800">
              Değerlerimiz
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Misyonumuz ve Vizyonumuz</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Misyon Kartı (Mavi) */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                <Target className="w-32 h-32 md:w-48 md:h-48 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Misyonumuz</h3>
                </div>
                <p className="text-blue-100 leading-relaxed text-base md:text-lg">
                  {settings.mission_content || "..."}
                </p>
              </div>
            </div>

            {/* Vizyon Kartı (Mor) */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 md:p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                <Globe className="w-32 h-32 md:w-48 md:h-48 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Vizyonumuz</h3>
                </div>
                <p className="text-purple-100 leading-relaxed text-base md:text-lg">
                  {settings.vision_content || "..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Alt Bant (İkonlu) - Call to Action */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Teknoloji İhtiyaçlarınız İçin Bize Ulaşın</h2>
              <p className="text-blue-100 mb-8 md:mb-12 max-w-2xl mx-auto opacity-90 text-sm md:text-base">
                Uzman ekibimizle projelerinizi hayata geçirmeye hazırız. Size en uygun çözümü birlikte bulalım.
              </p>

              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white mb-3" />
                  <div className="text-white font-bold text-base md:text-lg">Güvenilir Servis</div>
                  <div className="text-blue-200 text-xs">Tüm hizmetlerimizde kalite garantisi</div>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-white mb-3" />
                  <div className="text-white font-bold text-base md:text-lg">Uzman Ekip</div>
                  <div className="text-blue-200 text-xs">Alanında deneyimli teknisyenler</div>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="w-8 h-8 md:w-10 md:h-10 text-white mb-3" />
                  <div className="text-white font-bold text-base md:text-lg">Hızlı Çözüm</div>
                  <div className="text-blue-200 text-xs">En kısa sürede probleminizi çözüyoruz</div>
                </div>
              </div>
            </div>
            {/* Dekoratif Efektler */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full -ml-20 -mt-20"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-900 opacity-20 rounded-full -mr-20 -mb-20"></div>
          </div>
        </div>
      </section>

    </div>
  );
}