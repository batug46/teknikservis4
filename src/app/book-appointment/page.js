'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Calendar, Clock, MapPin, Phone, FileText, CheckCircle, AlertCircle, Plus } from 'lucide-react';


function BookAppointmentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();


  const [formData, setFormData] = useState({
    serviceType: searchParams.get('service') || '',
    description: '',
    date: '',
    time: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/book-appointment');
      return;
    }
  }, [status, router]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/products', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!res.ok) throw new Error('Hizmetler yüklenemedi');
        const data = await res.json();
        const serviceProducts = data.filter(product => product.category === 'hizmet');
        setServices(serviceProducts);

        const urlService = searchParams.get('service');
        if (urlService && serviceProducts.some(service => service.name === urlService)) {
          setFormData(prev => ({ ...prev, serviceType: urlService }));
        }
      } catch (err) {
        console.error('Hizmetler yüklenirken hata:', err);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.date) return;
      try {
        const res = await fetch(`/api/appointments/availability?date=${formData.date}`);
        const data = await res.json();
        setAvailableSlots(data);
      } catch (err) {
        console.error('Müsaitlik kontrolü yapılırken hata:', err);
      }
    };

    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.date]);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceType || !formData.date || !formData.time || !formData.phone || !formData.address) {
      setError('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Randevu oluşturulamadı.');
      }

      setSuccess('Randevunuz başarıyla oluşturuldu!');
      setFormData({ serviceType: '', description: '', date: '', time: '', phone: '', address: '' });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00'
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] pb-12 pt-4 md:pt-8 font-sans transition-colors duration-300 flex flex-col items-center">

      {/* Header Section */}
      <div className="text-center mb-8 px-4">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Randevu Oluştur
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Hızlı ve kolay servis randevusu alın
        </p>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-4xl px-4">
        <div className="bg-white dark:bg-[#151f32] rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-colors">

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl flex items-center space-x-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl flex items-center space-x-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-semibold">{success}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Servis Tipi */}
            <div className="space-y-2">
              <label htmlFor="serviceType" className="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                Hizmet Türü
              </label>
              <div className="relative">
                <select
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm appearance-none font-medium"
                >
                  <option value="">Seçiniz...</option>
                  {services.map(service => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Özel Notlar */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                Özel Notlar
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Cihazınızın sorunu hakkında kısaca bilgi verin..."
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none sm:text-sm font-medium"
              />
            </div>

            {/* Grid: Telefon ve Adres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Telefon Numarası"
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Adres
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={1}
                  placeholder="Adres"
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none sm:text-sm min-h-[50px] font-medium"
                />
              </div>
            </div>

            {/* Grid: Tarih ve Saat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Tarih Seçin
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm font-medium"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                  Saat Seçin
                </label>
                <div className="relative">
                  <select
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm appearance-none font-medium"
                  >
                    <option value="">Seçiniz...</option>
                    {timeSlots.map(time => {
                      const slotCount = availableSlots[time] || 0;
                      const isAvailable = slotCount < 2;
                      return (
                        <option
                          key={time}
                          value={time}
                          disabled={!isAvailable}
                          className={!isAvailable ? 'text-gray-400 dark:text-gray-600' : ''}
                        >
                          {time} {!isAvailable ? '(Dolu)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-[0.98] text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Randevu Oluştur
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">...</h2>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BookAppointmentForm />
    </Suspense>
  );
}