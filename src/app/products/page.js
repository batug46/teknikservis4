'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart,
  Calendar,
  Package,
  Wrench,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';


export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const router = useRouter();


  // Filtreleme ve arama state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products', {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          const activeProducts = data.filter(product => product.isActive !== false);
          setAllProducts(activeProducts);
        } else {
          console.error('Ürünler yüklenemedi:', response.status);
        }
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (stockFilter === 'instock') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (stockFilter === 'outstock') {
      filtered = filtered.filter(product => product.stock <= 0);
    }

    if (minPrice) {
      filtered = filtered.filter(product => parseFloat(product.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => parseFloat(product.price) <= parseFloat(maxPrice));
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
          break;
        case 'price':
          comparison = parseFloat(a.price) - parseFloat(b.price);
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, categoryFilter, stockFilter, minPrice, maxPrice, sortBy, sortOrder]);

  const formatPrice = (price) => {
    if (!price) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const handleBookAppointment = (serviceName) => {
    router.push(`/book-appointment?service=${encodeURIComponent(serviceName)}`);
  };

  const handleAddToCart = (productToAdd) => {
    try {
      // ✅ GÜVENLİK: Cart item'ını sanitize et
      const sanitizeCartItem = (item) => ({
        id: parseInt(item.id) || 0,
        name: String(item.name || '').slice(0, 200),
        price: Math.max(0, parseFloat(item.price) || 0),
        imageUrl: String(item.imageUrl || '').slice(0, 500),
        stock: Math.max(0, parseInt(item.stock) || 0),
        category: item.category === 'hizmet' || item.category === 'urun' ? item.category : 'urun'
      });

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Cart boyut kontrolü (max 20 farklı ürün)
      if (cart.length >= 20 && !cart.find(item => item.id === productToAdd.id)) {
        alert('Sepetinizde maksimum 20 farklı ürün bulunabilir.');
        return;
      }

      const existingItem = cart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        // Max 99 adet kontrolü
        existingItem.quantity = Math.min(99, existingItem.quantity + 1);
      } else {
        const sanitizedItem = sanitizeCartItem(productToAdd);
        cart.push({ ...sanitizedItem, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      setAddedToCart(productToAdd.id);
      setTimeout(() => setAddedToCart(null), 2000);
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      alert('Ürün sepete eklenirken bir hata oluştu.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStockFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const activeFiltersCount = [
    searchTerm,
    categoryFilter !== 'all',
    stockFilter !== 'all',
    minPrice,
    maxPrice,
    sortBy !== 'name' || sortOrder !== 'asc'
  ].filter(Boolean).length;

  const physicalProducts = filteredProducts.filter(p => p.category === 'urun');
  const serviceProducts = filteredProducts.filter(p => p.category === 'hizmet');

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Yükleniyor...</span>
    </div>
  );

  const FilterSidebar = ({ className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center">
          <Sliders className="w-4 h-4 mr-2" />
          Filtreler
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            <X className="w-3 h-3" />
            Temizle
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-2.5 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tümü</option>
            <option value="urun">Ürünler</option>
            <option value="hizmet">Hizmetler</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Stok Durumu</label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full px-2.5 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tümü</option>
            <option value="instock">Stokta Var</option>
            <option value="outstock">Stokta Yok</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Fiyat Aralığı (₺)</label>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Min Fiyat"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-2.5 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Max Fiyat"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-2.5 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Sıralama</label>
          <div className="space-y-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
            >
              <option value="name">İsme Göre</option>
              <option value="price">Fiyat</option>
              <option value="stock">Stok Durumuna Göre</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full flex items-center justify-center gap-2 px-2.5 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              {sortOrder === 'asc' ? (
                <>
                  <SortAsc className="w-3 h-3" />
                  Artan
                </>
              ) : (
                <>
                  <SortDesc className="w-3 h-3" />
                  Azalan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    // İSTEK: "biraz solda ve üstte olsun" -> py-6 yerine pt-4, mx-auto yerine ml-4 veya md:ml-12
    <div className="w-full md:w-[98%] mx-0 md:ml-2 lg:ml-4 px-4 pt-4 pb-6 transition-colors duration-300">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">Ürünler & Hizmetler</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Aradığınız ürünü kolayca bulun</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3">
            <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {filteredProducts.length} ürün bulundu
            </span>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              Filtreler
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {showMobileFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showMobileFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <FilterSidebar />
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar className="sticky top-24" />
        </div>

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Sonuç Bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aradığınız kriterlere uygun ürün bulunamadı. Lütfen filtrelerinizi değiştirip tekrar deneyin.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {physicalProducts.length > 0 && (
                <div>
                  <div className="flex items-center mb-5">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      Ürünlerimiz ({physicalProducts.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {physicalProducts.map(product => (
                      <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {product.imageUrl && (
                          <Link href={`/products/${product.id}`} className="block cursor-pointer">
                            <div className="aspect-w-16 aspect-h-9">
                              <img
                                src={product.imageUrl}
                                className="w-full h-48 object-cover"
                                alt={product.name}
                              />
                            </div>
                          </Link>
                        )}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{product.description}</p>

                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-baseline space-x-2">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(product.price)} ₺</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <>
                                    <span className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)} ₺</span>
                                    <span className="text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                                      %{calculateDiscount(product.originalPrice, product.price)} İndirim
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center mt-1">
                                {product.category === 'hizmet' ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-sm text-green-600 dark:text-green-400">Müsait</span>
                                  </>
                                ) : product.stock > 0 ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-sm text-green-600 dark:text-green-400">Stok: {product.stock}</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-red-500 mr-1" />
                                    <span className="text-sm text-red-600 dark:text-red-400">Stok Tükendi</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Link
                              href={`/products/${product.id}`}
                              className="w-full px-4 py-3 bg-black/60 text-white rounded-lg font-semibold 
                                       hover:bg-black/80 transition-colors duration-300 
                                       flex items-center justify-center gap-2"
                            >
                              <Eye size={20} />
                              Ürünü İncele
                            </Link>

                            <button
                              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ease-out flex items-center justify-center ${product.stock <= 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : addedToCart === product.id
                                  ? 'bg-green-600 text-white'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock <= 0}
                            >
                              {product.stock <= 0 ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Stok Tükendi
                                </>
                              ) : addedToCart === product.id ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Sepete Eklendi
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Sepete Ekle
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {serviceProducts.length > 0 && (
                <div>
                  <div className="flex items-center mb-5">
                    <Wrench className="w-5 h-5 mr-2 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      Teknik Servis Hizmetlerimiz ({serviceProducts.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {serviceProducts.map(service => (
                      <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {service.imageUrl && (
                          <div className="aspect-w-16 aspect-h-9 cursor-pointer" onClick={() => handleBookAppointment(service.name)}>
                            <img
                              src={service.imageUrl}
                              className="w-full h-48 object-cover"
                              alt={service.name}
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{service.description}</p>

                          <div className="mb-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Başlangıç Fiyatı:</span>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(service.price)} ₺</div>
                          </div>

                          <button
                            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 ease-out flex items-center justify-center"
                            onClick={() => handleBookAppointment(service.name)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Randevu Al
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}