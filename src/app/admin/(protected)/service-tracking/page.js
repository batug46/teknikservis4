'use client';

import React, { useState, useEffect } from 'react';
import {
    Package, Search, Plus, Edit2, Trash2, X, Check,
    User, Smartphone, Wrench, AlertCircle
} from 'lucide-react';

export default function ServiceTrackingAdminPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' }); // Toast notification


    // Form State
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deviceType: 'Laptop',
        brand: '',
        model: '',
        serialNumber: '',
        problem: '',
        accessories: '',
        estimatedCost: '',
        status: 'RECEIVED',
        diagnosis: '',
        description: '',
        finalCost: ''
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await fetch('/api/admin/service-tracking');
            if (res.ok) {
                const data = await res.json();
                setRecords(data);
            }
        } catch (error) {
            console.error('Kayıtlar yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basit validasyon
        if (!formData.customerName || !formData.customerPhone || !formData.problem) {
            setMessage({ type: 'danger', text: 'Lütfen zorunlu alanları doldurun.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        try {
            const url = isEditMode
                ? `/api/admin/service-tracking/${currentRecord.id}`
                : '/api/admin/service-tracking';

            const method = isEditMode ? 'PUT' : 'POST';

            // AKILLI KONTROL: Eğer iptal talebi varsa ve admin durumu İPTAL veya ONAY BEKLİYOR dışında 
            // başka bir şeye çektiyse (örn: Arıza Tespiti), bu "Reddet ve Devam Et" demektir.
            // İptal nedenini otomatik olarak temizliyoruz.
            let dataToSend = { ...formData };
            if (isEditMode && currentRecord?.cancellationReason) {
                if (formData.status !== 'CANCELLED' && formData.status !== 'PENDING_APPROVAL') {
                    dataToSend.cancellationReason = null;
                }
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: isEditMode ? 'Kayıt başarıyla güncellendi! ✓' : 'Yeni servis kaydı oluşturuldu! ✓' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                fetchRecords();
                closeModal();
            } else {
                const err = await res.json();
                setMessage({ type: 'danger', text: err.error || 'İşlem başarısız.' });
                setTimeout(() => setMessage({ type: '', text: '' }), 4000);
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Bağlantı hatası. Lütfen tekrar deneyin.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/admin/service-tracking/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setRecords(prev => prev.filter(rec => rec.id !== id));
            }
        } catch (error) {
            alert('Silme işlemi başarısız.');
        }
    };

    const handleCancelDecision = async (approved) => {
        if (!confirm(approved ? 'İptal işlemini onaylıyor musunuz?' : 'İptal talebini reddedip sürece devam etmek istiyor musunuz?')) return;

        try {
            // REDDETME DURUMU (Sürece Devam Et)
            if (!approved) {
                // Sadece iptal nedenini siliyoruz, durumu değiştirmiyoruz (Admin formdan kendi düzeltsin)
                const finalData = {
                    ...currentRecord, // Mevcut veriyi koru
                    cancellationReason: null // Nedeni sil
                };

                const res = await fetch(`/api/admin/service-tracking/${currentRecord.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData)
                });

                if (res.ok) {
                    alert('İptal talebi kaldırıldı. Form düzenlemeye açıldı, lütfen durumu kontrol edip kaydedin.');

                    // 1. Local state'i güncelle (Formun kilidini anında açar)
                    setCurrentRecord(prev => ({ ...prev, cancellationReason: null }));

                    // 2. Listeyi arkada güncelle
                    fetchRecords();

                    // 3. MODALI KAPATMIYORUZ, Admin düzenlemeye devam etsin.
                } else {
                    alert('İşlem başarısız.');
                }
            }
            // ONAYLAMA DURUMU (İptal Et)
            else {
                const finalData = {
                    ...currentRecord,
                    status: 'CANCELLED',
                    cancellationReason: currentRecord.cancellationReason // Nedeni koru (Log için)
                };

                const res = await fetch(`/api/admin/service-tracking/${currentRecord.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData)
                });

                if (res.ok) {
                    alert('İptal onaylandı.'); // "kayıt kapatıldı" kısmını sildik çünkü kapatmıyoruz

                    // Modalı kapatmıyoruz, sadece UI'ı güncelliyoruz
                    // Status'u CANCELLED yapıyoruz ki UI değişsin
                    setCurrentRecord(prev => ({ ...prev, status: 'CANCELLED' }));
                    setFormData(prev => ({ ...prev, status: 'CANCELLED' }));

                    fetchRecords();
                } else {
                    alert('İşlem başarısız.');
                }
            }

        } catch (error) {
            console.error(error);
            alert('Hata oluştu.');
        }
    };

    const openNewModal = () => {
        setIsEditMode(false);
        setFormData({
            customerName: '', customerPhone: '', customerEmail: '',
            deviceType: 'Laptop', brand: '', model: '',
            serialNumber: '', problem: '', accessories: '',
            estimatedCost: '', status: 'RECEIVED',
            diagnosis: '', description: '', adminNotes: '', finalCost: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        setIsEditMode(true);
        setCurrentRecord(record);
        setFormData({
            customerName: record.customerName,
            customerPhone: record.customerPhone,
            customerEmail: record.customerEmail || '',
            deviceType: record.deviceType,
            brand: record.brand,
            model: record.model,
            serialNumber: record.serialNumber || '',
            problem: record.problem,
            accessories: record.accessories || '',
            estimatedCost: record.estimatedCost || '',
            status: record.status,
            diagnosis: record.diagnosis || '',
            description: record.description || '',
            adminNotes: record.adminNotes || '',
            finalCost: record.finalCost || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentRecord(null);
    };

    const filteredRecords = records.filter(rec =>
        rec.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.customerPhone.includes(searchTerm)
    );

    const getStatusColor = (status) => {
        const colors = {
            'RECEIVED': 'bg-blue-100 text-blue-800',
            'DIAGNOSING': 'bg-yellow-100 text-yellow-800',
            'IN_PROGRESS': 'bg-indigo-100 text-indigo-800',
            'WAITING_PARTS': 'bg-purple-100 text-purple-800',
            'READY': 'bg-green-100 text-green-800',
            'DELIVERED': 'bg-gray-100 text-gray-800',
            'CANCELLED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {/* Toast Notification */}
            {message.text && (
                <div className="fixed top-20 right-4 z-50 animate-slide-in-right max-w-md">
                    <div className={`${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900 border-green-500'
                            : 'bg-red-50 dark:bg-red-900 border-red-500'
                        } border-l-4 rounded-lg shadow-lg p-4`}>
                        <div className="flex items-start">
                            {message.type === 'success' ? (
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            <div className={`${message.type === 'success'
                                    ? 'text-green-800 dark:text-green-100'
                                    : 'text-red-800 dark:text-red-100'
                                } font-medium`}>{message.text}</div>
                            <button
                                onClick={() => setMessage({ type: '', text: '' })}
                                className={`ml-auto pl-3 ${message.type === 'success'
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    } hover:opacity-70 transition-opacity`}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Wrench className="w-6 h-6 mr-2" />
                    Servis Takip Yönetimi
                </h1>
                <button
                    onClick={openNewModal}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Kayıt
                </button>
            </div>

            {/* Arama */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="İsim, Takip Kodu veya Tel No ile ara..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Takip Kodu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Müşteri</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cihaz</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durum</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ücret</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4">Yükleniyor...</td></tr>
                        ) : filteredRecords.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4">Kayıt bulunamadı.</td></tr>
                        ) : (
                            filteredRecords.map((rec) => (
                                <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-blue-600 dark:text-blue-400">
                                        {rec.trackingCode}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{rec.customerName}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{rec.customerPhone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {rec.brand} {rec.model} <br />
                                        <span className="text-xs bg-gray-100 dark:bg-gray-600 px-1 rounded">{rec.deviceType}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rec.status)}`}>
                                            {rec.status}
                                        </span>
                                        {rec.cancellationReason && (
                                            rec.status === 'CANCELLED' ? (
                                                <div className="mt-1 flex items-center text-xs font-bold text-green-600">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    İptal Onaylandı
                                                </div>
                                            ) : (
                                                <div className="mt-1 flex items-center text-xs font-bold text-red-600 animate-pulse">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    İptal İsteği
                                                </div>
                                            )
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-bold">
                                        {rec.finalCost ? `${rec.finalCost} ₺` : (rec.estimatedCost ? `~${rec.estimatedCost} ₺` : '-')}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openEditModal(rec)} className="text-blue-600 hover:text-blue-900"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(rec.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {isEditMode ? 'Kaydı Düzenle' : 'Yeni Servis Kaydı'}
                            </h2>
                            <button onClick={closeModal}><X className="w-6 h-6 text-gray-500" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* İptal Talebi Uyarısı - En Tepeye Taşındı */}
                            {isEditMode && currentRecord?.cancellationReason && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-md animate-bounce-slow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h4 className="font-bold text-red-700 flex items-center text-sm">
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            MÜŞTERİ İPTAL TALEBİ:
                                        </h4>
                                        <p className="text-red-600 text-sm mt-1 ml-6 font-medium">
                                            "{currentRecord.cancellationReason}"
                                        </p>
                                    </div>

                                    {/* Durum CANCELLED ise butonları gizle, onaylandı mesajı göster */}
                                    {currentRecord.status === 'CANCELLED' ? (
                                        <div className="px-4 py-2 bg-green-100 text-green-800 text-sm font-bold rounded flex items-center">
                                            <Check className="w-4 h-4 mr-2" />
                                            İPTAL ONAYLANDI
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleCancelDecision(false)}
                                                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 flex-1 md:flex-none"
                                            >
                                                Reddet / Devam Et
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCancelDecision(true)}
                                                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-bold flex-1 md:flex-none"
                                            >
                                                İptali Onayla
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Müşteri Bilgileri */}
                            {/* Eğer aktif bir iptal talebi varsa, Admin önce ona karar vermelidir. Formun geri kalanı kilitlenir. */}
                            {/* AYRICA: İptal onaylandıysa (CANCELLED) form kalıcı olarak kilitli kalır. */}
                            <fieldset
                                disabled={(isEditMode && currentRecord?.cancellationReason && formData.status !== 'CANCELLED') || formData.status === 'CANCELLED'}
                                className={`space-y-4 transition-opacity duration-300 ${(isEditMode && currentRecord?.cancellationReason && formData.status !== 'CANCELLED') || formData.status === 'CANCELLED' ? 'opacity-50 pointer-events-none filter grayscale-[0.5]' : ''}`}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Müşteri Adı *</label>
                                        <input name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Telefon *</label>
                                        <input name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">E-Posta (Profil Eşleşmesi İçin Önemli) *</label>
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-2 dark:bg-gray-700"
                                            placeholder="ornek@email.com"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Müşteri siteye üye olduğunda eski kayıtlarını görebilmesi için gereklidir.</p>
                                    </div>
                                </div>

                                {/* Cihaz Bilgileri */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Cihaz Tipi *</label>
                                        <select name="deviceType" value={formData.deviceType} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700">
                                            <option>Laptop</option>
                                            <option>Masaüstü PC</option>
                                            <option>Telefon</option>
                                            <option>Tablet</option>
                                            <option>Diğer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Marka *</label>
                                        <input name="brand" value={formData.brand} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Model</label>
                                        <input name="model" value={formData.model} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700" />
                                    </div>
                                </div>

                                {/* Arıza Bilgisi */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Arıza / Sorun *</label>
                                    <textarea name="problem" value={formData.problem} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700" rows="2" required />
                                </div>

                                {/* Admin Tarafından Düzenlenebilir Alanlar (Sadece Edit Modunda Daha Detaylı) */}
                                {isEditMode && (
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4 border border-blue-100 dark:border-blue-900">
                                        <h3 className="font-semibold text-blue-600 dark:text-blue-400">Teknik Servis İşlemleri</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Durum</label>
                                                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700 font-semibold text-blue-800">
                                                    <option value="RECEIVED">Teslim Alındı</option>
                                                    <option value="DIAGNOSING">Arıza Tespiti</option>
                                                    <option value="PENDING_APPROVAL">Onay Bekliyor</option>
                                                    <option value="WAITING_PARTS">Parça Bekleniyor</option>
                                                    <option value="IN_PROGRESS">Tamir Ediliyor</option>
                                                    <option value="READY">Teslime Hazır</option>
                                                    <option value="DELIVERED">Teslim Edildi</option>
                                                    <option value="CANCELLED">İptal / İade</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Teknik Tespit</label>
                                                <input name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Yapılan İşlemler (Müşteri Görür)</label>
                                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700" rows="3" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-1 text-red-600 dark:text-red-400 flex items-center">
                                                <span className="mr-2">🔒</span>
                                                Admin/Tekniker Notları (MÜŞTERİ GÖREMEZ)
                                            </label>
                                            <textarea
                                                name="adminNotes"
                                                value={formData.adminNotes}
                                                onChange={handleInputChange}
                                                className="w-full border rounded p-2 dark:bg-gray-700 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900 focus:ring-red-500"
                                                rows="2"
                                                placeholder="Sadece personel içindir. Örn: Yan sanayi parça takıldı, müşteri indirim istedi vs."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Tahmini Ücret</label>
                                                <input type="number" name="estimatedCost" value={formData.estimatedCost} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Sonuç Ücreti</label>
                                                <input type="number" name="finalCost" value={formData.finalCost} onChange={handleInputChange} className="w-full border rounded p-2 dark:bg-gray-700 font-bold text-green-600" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2 pt-4 border-t">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">İptal</button>
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                                        <Check className="w-4 h-4 mr-2" />
                                        Kaydet
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
