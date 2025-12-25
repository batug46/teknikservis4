// Dosya Yolu: src/app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { addSecurityHeaders } from '../../../../lib/securityHeaders';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Admin authentication kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
    ]);

    const response = NextResponse.json({ totalUsers, totalProducts, totalOrders });
    return addSecurityHeaders(response);
  } catch (error) {
    return NextResponse.json({ error: "Veriler alınamadı." }, { status: 500 });
  }
}