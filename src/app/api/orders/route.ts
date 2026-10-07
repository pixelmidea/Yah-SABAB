import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import StoreSettings from '@/models/StoreSettings';
import Notification from '@/models/Notification';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { validateBDPhoneNumber } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    // If Admin, can view all orders with filter
    if (authUser.role === 'admin') {
      const status = searchParams.get('status');
      const paymentStatus = searchParams.get('paymentStatus');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '15', 10);

      const filter: any = {};
      if (status && status !== 'all') filter.orderStatus = status;
      if (paymentStatus && paymentStatus !== 'all') filter['paymentInfo.status'] = paymentStatus;

      if (search) {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { orderNumber: searchRegex },
          { 'shippingAddress.fullName': searchRegex },
          { 'shippingAddress.phone': searchRegex },
          { 'paymentInfo.transactionId': searchRegex }
        ];
      }

      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Order.countDocuments(filter)
      ]);

      return NextResponse.json({
        success: true,
        orders,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    }

    // Customer: return user's orders
    const orders = await Order.find({ user: authUser.userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod, // 'COD' | 'bKash' | 'Nagad' | 'Rocket'
      senderNumber,
      transactionId,
      couponCode
    } = body;

    // Basic Input Validations
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Your shopping cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.district || !shippingAddress.address) {
      return NextResponse.json(
        { success: false, error: 'Please provide full delivery address and contact phone number' },
        { status: 400 }
      );
    }

    if (!validateBDPhoneNumber(shippingAddress.phone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Bangladesh mobile phone number' },
        { status: 400 }
      );
    }

    if (!['COD', 'bKash', 'Nagad', 'Rocket'].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method selected' },
        { status: 400 }
      );
    }

    if (paymentMethod !== 'COD' && (!senderNumber || !transactionId)) {
      return NextResponse.json(
        { success: false, error: `Please provide sender phone number and ${paymentMethod} Transaction ID` },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const authUser = getAuthUser(req);

    // 1. Fetch Store Settings for Delivery Charge Calculation
    const settings = await StoreSettings.findOne().lean();
    const isDhaka = shippingAddress.district.trim().toLowerCase() === 'dhaka';
    const baseDeliveryFee = isDhaka
      ? settings?.insideDhakaFee || 80
      : settings?.outsideDhakaFee || 130;

    // 2. Strict Backend Pricing & Inventory Verification
    let serverSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId || item.product);

      if (!dbProduct || !dbProduct.isActive) {
        return NextResponse.json(
          { success: false, error: `Product "${item.name || 'item'}" is no longer available` },
          { status: 400 }
        );
      }

      // Check variant stock if specified
      let itemPrice = dbProduct.discountPrice && dbProduct.discountPrice > 0 ? dbProduct.discountPrice : dbProduct.price;
      let sku = dbProduct.sku;

      if (item.size || item.color) {
        const variant = dbProduct.variants.find(
          (v: any) =>
            (!item.size || v.size === item.size) &&
            (!item.color || v.color === item.color)
        );

        if (variant) {
          if (variant.stock < item.quantity) {
            return NextResponse.json(
              {
                success: false,
                error: `Insufficient stock for "${dbProduct.name}" (${item.size || ''}). Only ${variant.stock} left in stock.`
              },
              { status: 400 }
            );
          }
          // Deduct stock from variant
          variant.stock -= item.quantity;
          if (variant.sku) sku = variant.sku;
        } else if (dbProduct.totalStock < item.quantity) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.totalStock} available.` },
            { status: 400 }
          );
        }
      } else {
        if (dbProduct.totalStock < item.quantity) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.totalStock} available.` },
            { status: 400 }
          );
        }
      }

      // Recalculate product total stock
      dbProduct.totalStock = dbProduct.variants.length > 0
        ? dbProduct.variants.reduce((sum: number, v: any) => sum + v.stock, 0)
        : Math.max(0, dbProduct.totalStock - item.quantity);

      await dbProduct.save();

      const itemTotal = itemPrice * item.quantity;
      serverSubtotal += itemTotal;

      validatedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        image: dbProduct.images[0] || '',
        price: itemPrice,
        size: item.size || '',
        color: item.color || '',
        sku,
        quantity: item.quantity
      });
    }

    // 3. Coupon Validation
    let discountAmount = 0;
    let appliedCoupon = '';

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
      if (coupon && new Date(coupon.expiryDate) > new Date()) {
        if (!coupon.minOrderAmount || serverSubtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'percentage') {
            discountAmount = (serverSubtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
              discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
          } else {
            discountAmount = Math.min(coupon.discountValue, serverSubtotal);
          }
          appliedCoupon = coupon.code;
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    // Free shipping threshold check
    let finalDeliveryFee = baseDeliveryFee;
    if (settings?.freeShippingThreshold && serverSubtotal >= settings.freeShippingThreshold) {
      finalDeliveryFee = 0;
    }

    const totalAmount = Math.max(0, serverSubtotal - discountAmount + finalDeliveryFee);

    // 4. Determine Initial Status
    const orderNumber = `#ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const isManualPayment = paymentMethod !== 'COD';

    const orderStatus = isManualPayment ? 'Payment Pending' : 'Pending';
    const paymentStatus = isManualPayment ? 'Payment Pending' : 'Unpaid';

    const newOrder = await Order.create({
      orderNumber,
      user: authUser ? authUser.userId : undefined,
      items: validatedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        email: shippingAddress.email ? shippingAddress.email.trim() : '',
        district: shippingAddress.district.trim(),
        area: shippingAddress.area.trim(),
        address: shippingAddress.address.trim()
      },
      paymentInfo: {
        method: paymentMethod,
        status: paymentStatus,
        senderNumber: senderNumber ? senderNumber.trim() : '',
        transactionId: transactionId ? transactionId.trim().toUpperCase() : '',
        amountPaid: isManualPayment ? totalAmount : 0
      },
      subtotal: serverSubtotal,
      discountAmount,
      couponCode: appliedCoupon,
      deliveryFee: finalDeliveryFee,
      totalAmount,
      orderStatus,
      statusHistory: [
        {
          status: orderStatus,
          note: isManualPayment
            ? `Order placed via ${paymentMethod}. Trx ID: ${transactionId} submitted.`
            : 'Order placed via Cash on Delivery',
          updatedAt: new Date()
        }
      ]
    });

    // 5. Trigger Admin Notification
    await Notification.create({
      title: `New Order ${orderNumber}`,
      message: `${shippingAddress.fullName} placed an order for ৳${totalAmount.toLocaleString('en-BD')} via ${paymentMethod}.`,
      type: isManualPayment ? 'payment' : 'order',
      link: `/admin/orders/${newOrder._id}`
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error: any) {
    console.error('Checkout Order Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
