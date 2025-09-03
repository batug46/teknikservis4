import prisma from '../../../lib/prisma';
import { Users, ShoppingCart, Calendar, Package, LayoutTemplate, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function StatCard({ title, value, icon, link, linkText }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="text-blue-600 dark:text-blue-400">
          <div className="w-6 h-6 sm:w-8 sm:h-8">
            {icon}
          </div>
        </div>
      </div>
      <div className="mt-3 sm:mt-4">
        <Link href={link} className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          {linkText} →
        </Link>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const orderCount = await prisma.order.count();
  const appointmentCount = await prisma.appointment.count({
    where: { status: 'PENDING' },
  });
  const pendingOrderCount = await prisma.order.count({
    where: { status: 'PENDING' },
  });
  const returnCount = await prisma.return.count({
    where: { status: 'PENDING' },
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Toplam Kullanıcı" 
          value={userCount} 
          icon={<Users className="w-6 h-6" />}
          link="/admin/users"
          linkText="Kullanıcıları Yönet"
        />
        <StatCard 
          title="Toplam Sipariş" 
          value={orderCount} 
          icon={<ShoppingCart className="w-6 h-6" />}
          link="/admin/orders"
          linkText="Siparişleri Görüntüle"
        />
        <StatCard 
          title="Bekleyen Randevular" 
          value={appointmentCount} 
          icon={<Calendar className="w-6 h-6" />}
          link="/admin/appointments"
          linkText="Randevuları Yönet"
        />
         <StatCard 
          title="Onay Bekleyen Siparişler" 
          value={pendingOrderCount} 
          icon={<ShoppingCart className="w-6 h-6 text-yellow-300" />}
          link="/admin/orders"
          linkText="Siparişleri Yönet"
        />
        <StatCard 
          title="Bekleyen İade Talepleri" 
          value={returnCount} 
          icon={<RefreshCw className="w-6 h-6 text-orange-500" />}
          link="/admin/returns"
          linkText="İade Taleplerini Yönet"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Hızlı Eylemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <Link href="/admin/products" className="bg-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base flex items-center justify-center">
            <Package className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ürün Yönetimi</span>
            <span className="sm:hidden">Ürünler</span>
          </Link>
          <Link href="/admin/services" className="bg-purple-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-purple-700 transition-colors text-sm sm:text-base flex items-center justify-center">
            <LayoutTemplate className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Hizmet Yönetimi</span>
            <span className="sm:hidden">Hizmetler</span>
          </Link>
          <Link href="/admin/slider" className="bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base flex items-center justify-center">
            <LayoutTemplate className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Slider Yönetimi</span>
            <span className="sm:hidden">Slider</span>
          </Link>
          <Link href="/admin/appointments" className="bg-gray-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Randevuları Kontrol Et</span>
            <span className="sm:hidden">Randevular</span>
          </Link>
          <Link href="/admin/returns" className="bg-orange-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-orange-700 transition-colors text-sm sm:text-base flex items-center justify-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">İade Taleplerini Yönet</span>
            <span className="sm:hidden">İadeler</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 