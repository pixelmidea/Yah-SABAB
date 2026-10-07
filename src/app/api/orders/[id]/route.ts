import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    let query: any = { _id: id };
    if (id.startsWith('#ORD-') || id.startsWith('ORD-')) {
      const orderNum = id.startsWith('#') ? id : `#${id}`;
      query = { orderNumber: orderNum };
    }

    const order = await Order.findOne(query).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Customer can only view their own order unless admin
    if (authUser.role !== 'admin' && order.user?.toString() !== authUser.userId) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error fetching order' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin authorization required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, status, rejectionReason, note } = body;

    await connectToDatabase();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // 1. Verify Payment Action
    if (action === 'verify_payment') {
      order.paymentInfo.status = 'Payment Verified';
      order.paymentInfo.verifiedAt = new Date();
      order.paymentInfo.verifiedBy = admin.userId as any;
      order.orderStatus = 'Confirmed';
      order.statusHistory.push({
        status: 'Confirmed',
        note: `Payment verified via ${order.paymentInfo.method} (Trx ID: ${order.paymentInfo.transactionId})`,
        updatedAt: new Date()
      });
    }
    // 2. Reject Payment Action
    else if (action === 'reject_payment') {
      order.paymentInfo.status = 'Payment Rejected';
      order.paymentInfo.rejectionReason = rejectionReason || 'Transaction ID not found or amount mismatch';
      order.statusHistory.push({
        status: order.orderStatus,
        note: `Payment rejected: ${rejectionReason || 'Invalid Transaction ID'}`,
        updatedAt: new Date()
      });
    }
    // 3. Status Workflow Update Action
    else if (status) {
      const prevStatus = order.orderStatus;
      order.orderStatus = status;
      order.statusHistory.push({
        status,
        note: note || `Status updated from ${prevStatus} to ${status}`,
        updatedAt: new Date()
      });

      // If cancelling order, restore stock
      if (status === 'Cancelled' && prevStatus !== 'Cancelled') {
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            if (item.size && product.variants.length > 0) {
              const variant = product.variants.find((v: any) => v.size === item.size);
              if (variant) variant.stock += item.quantity;
            }
            product.totalStock += item.quantity;
            await product.save();
          }
        }
      }
    }

    if (body.internalNotes) {
      order.internalNotes = body.internalNotes;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error: any) {
    console.error('Update Order Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
