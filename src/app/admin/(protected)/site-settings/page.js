'use client';

import React, { useState, useEffect } from 'react';
import { Save, Globe, Phone, Mail, MapPin, FileText, Target, Eye, Clock, Star, Heart, Shield } from 'lucide-react';

export default function SiteSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('contact');

    // Başlangıç değerleri (Boş gelirse hata vermesin diye)
    const [settings, setSettings] = useState({
        contact_phone: '',
        contact_email: '',
        contact_address: '',
        contact_map_url: '',
        about_title: '',
        about_content: '',
        mission_title: '',
        mission_content: '',
        vision_title: '',
        vision_content: '',
        // Hero Kartları (3 Adet - Hakkımızda En Üst)
        hero_card_1_title: 'Güvenilir Hizmet',
        hero_card_1_desc: '13 yıldır kesintisiz',
        hero_card_2_title: 'Geniş Hizmet Ağı',
        hero_card_2_desc: 'Ankara genelinde',
        hero_card_3_title: 'Kalite Garantisi',
        hero_card_3_desc: '%100 müşteri memnuniyeti',
        // Çalışma Saatleri
        hours_weekday: '09:00 - 18:00',
        hours_saturday: '10:00 - 16:00',
        hours_sunday: 'Kapalı',
        // Hizmetler (4 Adet)
        service_1_title: 'Bilgisayar ve Notebook Tamiri',
        service_1_desc: 'Tüm marka ve modellerde profesyonel tamir hizmeti',
        service_2_title: 'Güvenlik Kamera Sistemleri',
        service_2_desc: 'IP kameralar, analog sistemler ve görüntü analizi',
        service_3_title: 'Alarm Sistemleri',
        service_3_desc: 'Kablosuz alarm, sensörler ve akıllı güvenlik çözümleri',
        service_4_title: 'Donanım ve Yazılım Çözümleri',
        service_4_desc: 'Sistem kurulumu, konfigürasyon ve optimizasyon',
        // Avantajlar (3 Adet)
        advantage_1_title: '13 Yıllık Deneyim',
        advantage_1_desc: 'Sektörde edindiğimiz tecrübe ile en zorlu problemlere bile çözüm üretiyoruz.',
        advantage_2_title: 'Uzman Ekip',
        advantage_2_desc: 'Alanında uzman teknisyenlerimizle profesyonel hizmet sunuyoruz.',
        advantage_3_title: 'Kalite Garantisi',
        advantage_3_desc: 'Tüm hizmetlerimizde müşteri memnuniyetini garanti ediyoruz.',
    });

    // Ayarları Yükle
    useEffect(() => {
        fetch('/api/admin/site-settings')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/site-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert('Ayarlar başarıyla kaydedildi!');
            } else {
                alert('Kaydedilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error(error);
            alert('Bağlantı hatası.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Ayarlar yükleniyor...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Site İçerik Ayarları</h1>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 overflow-x-auto flex space-x-1">
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap ${activeTab === 'contact' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                    <Phone className="w-4 h-4 mr-2" />
                    İletişim
                </button>
                <button
                    onClick={() => setActiveTab('about')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap ${activeTab === 'about' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                    <FileText className="w-4 h-4 mr-2" />
                    Hakkımızda
                </button>
                <button
                    onClick={() => setActiveTab('hours')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap ${activeTab === 'hours' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                    <Clock className="w-4 h-4 mr-2" />
                    Çalışma Saatleri
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap ${activeTab === 'services' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                    <Target className="w-4 h-4 mr-2" />
                    Hizmetlerimiz
                </button>
                <button
                    onClick={() => setActiveTab('advantages')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center whitespace-nowrap ${activeTab === 'advantages' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                    <Star className="w-4 h-4 mr-2" />
                    Avantajlar
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Temel İletişim</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefon Numarası</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="contact_phone"
                                        value={settings.contact_phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="+90 555 123 45 67"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-Posta Adresi</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="contact_email"
                                        value={settings.contact_email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="info@tekniverse.xyz"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açık Adres</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <textarea
                                        name="contact_address"
                                        value={settings.contact_address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        placeholder="Örnek Mah. Teknoloji Cad..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Ekstra</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Google Maps Linki (Embed URL)</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="contact_map_url"
                                        value={settings.contact_map_url}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Google Haritalar'dan 'Paylaş' → 'Harita Yerleştir' diyerek aldığınız link.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-8">
                        {/* Hero Kartları */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 flex items-center">
                                <Heart className="w-5 h-5 mr-2" /> Sayfa Üstü Özellik Kartları (Hero)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Kart 1 */}
                                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <h4 className="font-bold mb-3 text-red-500">1. Kart (Kalp İkonlu)</h4>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="hero_card_1_title"
                                            value={settings.hero_card_1_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Güvenilir Hizmet"
                                        />
                                        <input
                                            type="text"
                                            name="hero_card_1_desc"
                                            value={settings.hero_card_1_desc}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="13 yıldır kesintisiz"
                                        />
                                    </div>
                                </div>
                                {/* Kart 2 */}
                                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <h4 className="font-bold mb-3 text-blue-500">2. Kart (Dünya İkonlu)</h4>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="hero_card_2_title"
                                            value={settings.hero_card_2_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Geniş Hizmet Ağı"
                                        />
                                        <input
                                            type="text"
                                            name="hero_card_2_desc"
                                            value={settings.hero_card_2_desc}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Ankara genelinde"
                                        />
                                    </div>
                                </div>
                                {/* Kart 3 */}
                                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <h4 className="font-bold mb-3 text-green-500">3. Kart (Kalkan İkonlu)</h4>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="hero_card_3_title"
                                            value={settings.hero_card_3_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Kalite Garantisi"
                                        />
                                        <input
                                            type="text"
                                            name="hero_card_3_desc"
                                            value={settings.hero_card_3_desc}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="%100 müşteri memnuniyeti"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Genel Hakkımızda */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 flex items-center">
                                <FileText className="w-5 h-5 mr-2" /> Hakkımızda Ana Metin
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    name="about_title"
                                    value={settings.about_title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Teknolojide Güvenilir Ortağınız"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İçerik (Paragraf)</label>
                                <textarea
                                    name="about_content"
                                    value={settings.about_content}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Şirketimiz 2010 yılında kurulmuş olup..."
                                />
                            </div>
                        </div>

                        {/* Misyon & Vizyon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 flex items-center">
                                    <Target className="w-5 h-5 mr-2" /> Misyonumuz
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Misyon Başlığı</label>
                                    <input
                                        type="text"
                                        name="mission_title"
                                        value={settings.mission_title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Misyonumuz"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Misyon İçeriği</label>
                                    <textarea
                                        name="mission_content"
                                        value={settings.mission_content}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Müşterilerimize en iyi hizmeti sunmak..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 flex items-center">
                                    <Eye className="w-5 h-5 mr-2" /> Vizyonumuz
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vizyon Başlığı</label>
                                    <input
                                        type="text"
                                        name="vision_title"
                                        value={settings.vision_title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Vizyonumuz"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vizyon İçeriği</label>
                                    <textarea
                                        name="vision_content"
                                        value={settings.vision_content}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Sektörde lider olmak..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hours' && (
                    <div className="space-y-6 max-w-2xl">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 flex items-center">
                            <Clock className="w-5 h-5 mr-2" /> Çalışma Saatleri Düzenleme
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hafta İçi (Pzt - Cum)</label>
                                <input
                                    type="text"
                                    name="hours_weekday"
                                    value={settings.hours_weekday}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="09:00 - 18:00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cumartesi</label>
                                <input
                                    type="text"
                                    name="hours_saturday"
                                    value={settings.hours_saturday}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="10:00 - 16:00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pazar</label>
                                <input
                                    type="text"
                                    name="hours_sunday"
                                    value={settings.hours_sunday}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Kapalı"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 flex items-center">
                            <Target className="w-5 h-5 mr-2" /> Hizmet Kartları (Hakkımızda & Anasayfa)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Hizmet 1 */}
                            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <h4 className="font-bold mb-3 text-blue-600">1. Hizmet Kutusu</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Başlık</label>
                                        <input
                                            type="text"
                                            name="service_1_title"
                                            value={settings.service_1_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Açıklama</label>
                                        <textarea
                                            name="service_1_desc"
                                            value={settings.service_1_desc}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hizmet 2 */}
                            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <h4 className="font-bold mb-3 text-green-600">2. Hizmet Kutusu</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Başlık</label>
                                        <input
                                            type="text"
                                            name="service_2_title"
                                            value={settings.service_2_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Açıklama</label>
                                        <textarea
                                            name="service_2_desc"
                                            value={settings.service_2_desc}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hizmet 3 */}
                            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <h4 className="font-bold mb-3 text-purple-600">3. Hizmet Kutusu</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Başlık</label>
                                        <input
                                            type="text"
                                            name="service_3_title"
                                            value={settings.service_3_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Açıklama</label>
                                        <textarea
                                            name="service_3_desc"
                                            value={settings.service_3_desc}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hizmet 4 */}
                            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <h4 className="font-bold mb-3 text-orange-600">4. Hizmet Kutusu</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Başlık</label>
                                        <input
                                            type="text"
                                            name="service_4_title"
                                            value={settings.service_4_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Açıklama</label>
                                        <textarea
                                            name="service_4_desc"
                                            value={settings.service_4_desc}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'advantages' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 flex items-center">
                            <Star className="w-5 h-5 mr-2" /> Avantaj Kartları
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Avantaj 1 */}
                            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <h4 className="font-bold mb-3 text-blue-600">1. Avantaj (Saat İkonlu)</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Başlık</label>
                                        <input
                                            type="text"
                                            name="advantage_1_title"
                                            value={settings.advantage_1_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Açıklama</label>
                                        <textarea
                                            name="advantage_1_desc"
                                            value={settings.advantage_1_desc}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Avantaj 2 */}
                            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <h4 className="font-bold mb-3 text-green-600">2. Avantaj (Kullanıcı İkonlu)</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Başlık</label>
                                        <input
                                            type="text"
                                            name="advantage_2_title"
                                            value={settings.advantage_2_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Açıklama</label>
                                        <textarea
                                            name="advantage_2_desc"
                                            value={settings.advantage_2_desc}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Avantaj 3 */}
                            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <h4 className="font-bold mb-3 text-purple-600">3. Avantaj (Ödül İkonlu)</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Başlık</label>
                                        <input
                                            type="text"
                                            name="advantage_3_title"
                                            value={settings.advantage_3_title}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase">Açıklama</label>
                                        <textarea
                                            name="advantage_3_desc"
                                            value={settings.advantage_3_desc}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
