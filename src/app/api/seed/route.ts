import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import StoreSettings from '@/models/StoreSettings';
import Order from '@/models/Order';
import Notification from '@/models/Notification';
import { hashPassword } from '@/lib/auth';
import { seedCategories, seedProducts, seedCoupons } from '@/lib/seedData';

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Seed StoreSettings
    await StoreSettings.deleteMany({});
    const storeSettings = await StoreSettings.create({
      storeName: 'Yah SABAB (ইয়াহ সাবাব)',
      tagline: 'Heritage & Modern Elegance for Men',
      phone: '01711223344',
      email: 'support@yahsabab.com',
      address: 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
      logoUrl: '/logo.png',
      insideDhakaFee: 80,
      outsideDhakaFee: 130,
      freeShippingThreshold: 3500,
      bkashNumber: '01711002233',
      nagadNumber: '01811002233',
      rocketNumber: '01911002233',
      codAvailable: true,
      minOrderValue: 0,
      announcementBarText: '✨ FREE Express Delivery nationwide on orders over ৳3,500 | Cash on Delivery & bKash Verified'
    });

    // 2. Seed Users
    await User.deleteMany({});
    const adminPassword = await hashPassword('Admin@123456');
    const customerPassword = await hashPassword('Customer@123456');

    const admin = await User.create({
      name: 'Yah SABAB Admin',
      email: 'admin@yahsabab.com',
      phone: '01711223344',
      password: adminPassword,
      role: 'admin',
      addresses: [
        {
          label: 'Store HQ',
          fullName: 'Store Admin',
          phone: '01711223344',
          district: 'Dhaka',
          area: 'Banani',
          address: 'House 42, Road 11, Block D',
          isDefault: true
        }
      ]
    });

    const customer = await User.create({
      name: 'Tanvir Hossain',
      email: 'tanvir@gmail.com',
      phone: '01799887766',
      password: customerPassword,
      role: 'customer',
      addresses: [
        {
          label: 'Home',
          fullName: 'Tanvir Hossain',
          phone: '01799887766',
          district: 'Dhaka',
          area: 'Dhanmondi',
          address: 'House 15, Road 8/A',
          isDefault: true
        }
      ]
    });

    // 3. Seed Categories
    await Category.deleteMany({});
    const createdCategoriesMap: Record<string, string> = {};
    for (const cat of seedCategories) {
      const createdCat = await Category.create(cat);
      createdCategoriesMap[cat.slug] = createdCat._id.toString();
    }

    // 4. Seed Products
    await Product.deleteMany({});
    const createdProducts = [];
    for (const prod of seedProducts) {
      // map category slug to Category ObjectId
      let catId = createdCategoriesMap['panjabi'];
      if (prod.slug.includes('kabli')) catId = createdCategoriesMap['kabli-suit'];
      if (prod.slug.includes('koti')) catId = createdCategoriesMap['koti'];
      if (prod.slug.includes('pajama')) catId = createdCategoriesMap['pajama'];

      const createdProd = await Product.create({
        ...prod,
        category: catId
      });
      createdProducts.push(createdProd);
    }

    // 5. Seed Coupons
    await Coupon.deleteMany({});
    await Coupon.insertMany(seedCoupons);

    // 6. Seed Notifications & Initial Sample Orders for immediate Admin Dashboard metrics
    await Order.deleteMany({});
    await Notification.deleteMany({});

    if (createdProducts.length >= 2) {
      const prod1 = createdProducts[0];
      const prod2 = createdProducts[1];

      // Order 1: bKash Payment Pending verification
      await Order.create({
        orderNumber: '#ORD-10482',
        user: customer._id,
        items: [
          {
            product: prod1._id,
            name: prod1.name,
            image: prod1.images[0],
            price: prod1.discountPrice || prod1.price,
            size: 'L (42)',
            color: 'Midnight Blue',
            sku: prod1.variants[1]?.sku || prod1.sku,
            quantity: 1
          }
        ],
        shippingAddress: {
          fullName: 'Tanvir Hossain',
          phone: '01799887766',
          email: 'tanvir@gmail.com',
          district: 'Dhaka',
          area: 'Dhanmondi',
          address: 'House 15, Road 8/A'
        },
        paymentInfo: {
          method: 'bKash',
          status: 'Payment Pending',
          senderNumber: '01799887766',
          transactionId: 'BK89X77A12',
          amountPaid: 3030
        },
        subtotal: prod1.discountPrice || prod1.price,
        discountAmount: 0,
        deliveryFee: 80,
        totalAmount: (prod1.discountPrice || prod1.price) + 80,
        orderStatus: 'Payment Pending',
        statusHistory: [
          { status: 'Pending', note: 'Order placed by customer', updatedAt: new Date(Date.now() - 3600000) },
          { status: 'Payment Pending', note: 'Customer submitted bKash Trx ID: BK89X77A12', updatedAt: new Date() }
        ]
      });

      // Order 2: Delivered Order (Cash on Delivery)
      await Order.create({
        orderNumber: '#ORD-10481',
        user: customer._id,
        items: [
          {
            product: prod2._id,
            name: prod2.name,
            image: prod2.images[0],
            price: prod2.discountPrice || prod2.price,
            size: 'M (40)',
            color: 'Off-White',
            sku: prod2.variants[0]?.sku || prod2.sku,
            quantity: 1
          }
        ],
        shippingAddress: {
          fullName: 'Tanvir Hossain',
          phone: '01799887766',
          email: 'tanvir@gmail.com',
          district: 'Chittagong',
          area: 'Agrabad',
          address: 'GEC Circle, Flat 4B'
        },
        paymentInfo: {
          method: 'COD',
          status: 'Payment Verified',
          amountPaid: 3380
        },
        subtotal: prod2.discountPrice || prod2.price,
        discountAmount: 0,
        deliveryFee: 130,
        totalAmount: (prod2.discountPrice || prod2.price) + 130,
        orderStatus: 'Delivered',
        statusHistory: [
          { status: 'Pending', note: 'Order placed', updatedAt: new Date(Date.now() - 86400000 * 2) },
          { status: 'Confirmed', note: 'Order confirmed', updatedAt: new Date(Date.now() - 86400000 * 2 + 1800000) },
          { status: 'Shipped', note: 'Handed to Steadfast Courier', updatedAt: new Date(Date.now() - 86400000) },
          { status: 'Delivered', note: 'Delivered successfully & cash collected', updatedAt: new Date(Date.now() - 3600000) }
        ]
      });

      await Notification.create({
        title: 'New Order Received',
        message: 'Order #ORD-10482 received with bKash Trx ID BK89X77A12 requiring verification.',
        type: 'payment',
        link: '/admin/orders'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      credentials: {
        admin: { email: 'admin@yahsabab.com', password: 'Admin@123456' },
        customer: { email: 'tanvir@gmail.com', password: 'Customer@123456' }
      },
      counts: {
        categories: seedCategories.length,
        products: createdProducts.length,
        coupons: seedCoupons.length,
        settings: 1
      }
    });
  } catch (error: any) {
    console.error('Database Seed Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}
