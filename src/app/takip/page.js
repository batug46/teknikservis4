'use client';

import React, { useState } from 'react';
import { Search, Package, Wrench, CheckCircle, Clock, AlertTriangle, XCircle, Truck, Info, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TrackingPage() {
    const [trackingCode, setTrackingCode] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cancel Modal State
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    const handleCancelRequest = async () => {
        if (!cancelReason.trim()) return alert('Lütfen bir neden belirtin.');

        setCancelLoading(true);
        try {
            const res = await fetch('/api/tracking', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trackingCode: result.trackingCode,
                    email: email, // Güvenlik için e-postayı da gönderiyoruz
                    reason: cancelReason
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                setIsCancelModalOpen(false);
                setCancelReason('');
                // Refresh result
                handleSearch({ preventDefault: () => { } });
            } else {
                alert(data.error || 'İptal talebi oluşturulamadı.');
            }
        } catch (error) {
            alert('Bağlantı hatası.');
        } finally {
            setCancelLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingCode.trim() || !email.trim()) {
            setError('Lütfen takip kodu ve e-posta adresini giriniz.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch(`/api/tracking?code=${trackingCode.trim().toUpperCase()}&email=${encodeURIComponent(email.trim())}`);
            const data = await res.json();

            if (res.ok) {
                setResult(data);
            } else {
                setError(data.error || 'Bir hata oluştu.');
            }
        } catch (err) {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'RECEIVED': return { label: 'Teslim Alındı', icon: Package, color: 'text-blue-500', bg: 'bg-blue-100', step: 1 };
            case 'DIAGNOSING': return { label: 'Arıza Tespiti', icon: Search, color: 'text-yellow-500', bg: 'bg-yellow-100', step: 2 };
            case 'PENDING_APPROVAL': return { label: 'İptal Talebi Alındı', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100', step: 2 };
            case 'WAITING_PARTS': return { label: 'Parça Bekleniyor', icon: Package, color: 'text-purple-500', bg: 'bg-purple-100', step: 3 };
            case 'IN_PROGRESS': return { label: 'Tamir Ediliyor', icon: Wrench, color: 'text-indigo-500', bg: 'bg-indigo-100', step: 3 };
            case 'COMPLETED': return { label: 'Tamamlandı', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', step: 4 };
            case 'READY': return { label: 'Teslime Hazır', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', step: 4 };
            case 'DELIVERED': return { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-gray-500', bg: 'bg-gray-100', step: 5 };
            case 'CANCELLED': return { label: 'İptal Edildi', icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', step: 0 };
            case 'UNREPAIRABLE': return { label: 'Tamir Edilemedi', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100', step: 4 };
            default: return { label: status, icon: Info, color: 'text-gray-500', bg: 'bg-gray-100', step: 0 };
        }
    };

    const currentStatus = result ? getStatusInfo(result.status) : null;
    // PENDING_APPROVAL durumunda da iptal butonu gizlenmeli (zaten talep edildi)
    const isCancellable = result && !['COMPLETED', 'DELIVERED', 'CANCELLED', 'UNREPAIRABLE', 'READY', 'PENDING_APPROVAL'].includes(result.status);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Cihaz Takip Sistemi
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Size verilen takip kodu ile cihazınızın durumunu anlık olarak sorgulayabilirsiniz.
                    </p>
                </div>

                {/* Arama Kutusu */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Takip Kodu Girin"
                            className="flex-1 px-5 py-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg font-medium tracking-wider uppercase"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                        />
                        <input
                            type="email"
                            placeholder="E-posta Adresi"
                            className="flex-1 px-5 py-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg font-medium tracking-wide"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Search className="w-5 h-5 mr-2" />
                                    Sorgula
                                </>
                            )}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Sonuç Alanı */}
                {result && currentStatus && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
                        {/* Üst Bilgi Kartı */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {result.brand} {result.model}
                                    </h2>
                                    <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                                        <span className="font-medium mr-2">{result.deviceType}</span>
                                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                                            {result.trackingCode}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`px-4 py-2 rounded-full flex items-center ${currentStatus.bg} ${currentStatus.color}`}>
                                        <currentStatus.icon className="w-5 h-5 mr-2" />
                                        <span className="font-bold">{currentStatus.label}</span>
                                    </div>
                                    {isCancellable && (
                                        <button
                                            onClick={() => setIsCancelModalOpen(true)}
                                            className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full text-sm font-medium transition-colors"
                                        >
                                            İptal Et
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Sol Taraf: Detaylar */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Arıza Bilgisi
                                    </h3>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {result.problem}
                                    </p>
                                </div>

                                {result.diagnosis && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Teknik Tespit
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {result.diagnosis}
                                        </p>
                                    </div>
                                )}

                                {result.description && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Yapılan İşlemler
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                            {result.description}
                                        </p>
                                    </div>
                                )}

                                {result.cancellationReason && (
                                    <div>
                                        <h3 className="text-sm font-medium text-red-500 uppercase tracking-wider mb-2">
                                            İptal Nedeni
                                        </h3>
                                        <p className="text-red-600 bg-red-50 p-2 rounded">
                                            {result.cancellationReason}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Kayıt Tarihi:
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {new Date(result.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>

                                {result.finalCost && (
                                    <div className="pt-2 flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400">Tutar:</span>
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {result.finalCost} ₺
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Sağ Taraf: İlerleme Çubuğu */}
                            <div className="relative pl-8 border-l border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    İşlem Durumu
                                </h3>

                                <div className="space-y-8">
                                    {[
                                        { key: 'RECEIVED', label: 'Cihaz Alındı' },
                                        { key: 'IN_PROGRESS', label: 'İşlemde/Tamirde' },
                                        { key: 'READY', label: 'Teslime Hazır' },
                                        { key: 'DELIVERED', label: 'Teslim Edildi' }
                                    ].map((step, index) => {
                                        // Adım mantığı: Eğer mevcut durumun "step" değeri bu adımınkinden büyük veya eşitse aktif
                                        let isActive = false;
                                        let isCompleted = false;

                                        // Basit bir adım haritası
                                        const stepMap = {
                                            'RECEIVED': 1,
                                            'DIAGNOSING': 1,
                                            'PENDING_APPROVAL': 1,
                                            'WAITING_PARTS': 2,
                                            'IN_PROGRESS': 2,
                                            'COMPLETED': 3,
                                            'READY': 3,
                                            'DELIVERED': 4
                                        };

                                        const currentStepVal = stepMap[result.status] || 0;
                                        const thisStepVal = index + 1;

                                        if (currentStatus.step === 0 && result.status !== 'RECEIVED' && result.status !== 'DELIVERED') {
                                            // İptal veya Tamir Edilemedi durumu
                                            isActive = false;
                                        } else {
                                            isCompleted = currentStepVal > thisStepVal;
                                            isActive = currentStepVal === thisStepVal;
                                        }

                                        if (result.status === step.key) isActive = true;

                                        return (
                                            <div key={step.key} className="relative flex items-center">
                                                <div className={`absolute -left-[41px] w-6 h-6 rounded-full border-2 flex items-center justify-center z-10
                          ${isActive || isCompleted || currentStepVal >= thisStepVal ? 'bg-blue-600 border-blue-600' : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'}
                        `}>
                                                    {(isCompleted || currentStepVal >= thisStepVal) && <CheckCircle className="w-4 h-4 text-white" />}
                                                </div>
                                                <div className={`text-sm font-medium ${isActive || isCompleted || currentStepVal >= thisStepVal ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                                                    {step.label}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancel Modal */}
                {isCancelModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">İptal Talebi Oluştur</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                                İşlemi iptal etmek istediğinize emin misiniz? Lütfen bir neden belirtin.
                            </p>
                            <textarea
                                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:text-white mb-4 focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Örn: Fiyat yüksek geldi / Vazgeçtim..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsCancelModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={handleCancelRequest}
                                    disabled={cancelLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                                >
                                    {cancelLoading ? 'İşleniyor...' : 'Onayla ve İptal Et'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
