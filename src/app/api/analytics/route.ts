import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin authorization required' }, { status: 403 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30days';

    const now = new Date();
    let startDate = new Date();

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'yesterday') {
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      now.setDate(now.getDate() - 1);
      now.setHours(23, 59, 59, 999);
    } else if (range === '7days') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === '30days') {
      startDate.setDate(now.getDate() - 30);
    } else if (range === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === 'thisYear') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (range === 'allTime') {
      startDate = new Date(2000, 0, 1);
    }

    // 1. Overall Key Metrics
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      revenueResult,
      salesOverTime,
      paymentBreakdown,
      statusBreakdown
    ] = await Promise.all([
      // Today's Sales & Orders
      Order.find({
        createdAt: { $gte: todayStart },
        orderStatus: { $ne: 'Cancelled' }
      }).lean(),

      // Total orders in selected range
      Order.countDocuments({
        createdAt: { $gte: startDate, $lte: now },
        orderStatus: { $ne: 'Cancelled' }
      }),

      // Pending orders
      Order.countDocuments({
        orderStatus: { $in: ['Pending', 'Payment Pending'] }
      }),

      // Total products & low stock
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, totalStock: { $lte: 5 } }),

      // Total registered customers
      User.countDocuments({ role: 'customer' }),

      // Revenue sum in range
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now },
            orderStatus: { $ne: 'Cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            avgOrderValue: { $avg: '$totalAmount' }
          }
        }
      ]),

      // Daily Sales chart data
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now },
            orderStatus: { $ne: 'Cancelled' }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            sales: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Payment method breakdown
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now },
            orderStatus: { $ne: 'Cancelled' }
          }
        },
        {
          $group: {
            _id: '$paymentInfo.method',
            count: { $sum: 1 },
            amount: { $sum: '$totalAmount' }
          }
        }
      ]),

      // Order status breakdown
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now }
          }
        },
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const avgOrderValue = revenueResult[0]?.avgOrderValue || 0;

    return NextResponse.json({
      success: true,
      summary: {
        todaySales,
        todayOrdersCount: todayOrders.length,
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalProducts,
        lowStockProducts,
        totalCustomers,
        avgOrderValue
      },
      charts: {
        salesOverTime: salesOverTime.map(item => ({ date: item._id, sales: item.sales, orders: item.orders })),
        paymentBreakdown: paymentBreakdown.map(item => ({ method: item._id, count: item.count, amount: item.amount })),
        statusBreakdown: statusBreakdown.map(item => ({ status: item._id, count: item.count }))
      }
    });
  } catch (error: any) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error generating analytics' }, { status: 500 });
  }
}
