import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import InventoryHistory from '@/models/InventoryHistory';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin authorization required' }, { status: 403 });
    }

    await connectToDatabase();
    const products = await Product.find({ isActive: true })
      .select('name sku totalStock lowStockThreshold variants price images')
      .sort({ totalStock: 1 })
      .lean();

    const history = await InventoryHistory.find().sort({ createdAt: -1 }).limit(20).lean();

    return NextResponse.json({ success: true, products, history });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin authorization required' }, { status: 403 });
    }

    const { productId, size, newStock, reason } = await req.json();

    if (!productId || newStock === undefined || newStock < 0) {
      return NextResponse.json({ success: false, error: 'Invalid stock adjustment parameters' }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    let prevStock = product.totalStock;
    if (size && product.variants.length > 0) {
      const variant = product.variants.find((v: any) => v.size === size);
      if (variant) {
        prevStock = variant.stock;
        variant.stock = parseInt(newStock, 10);
      }
      product.totalStock = product.variants.reduce((sum: number, v: any) => sum + v.stock, 0);
    } else {
      product.totalStock = parseInt(newStock, 10);
    }

    await product.save();

    // Log Inventory History Audit Record
    await InventoryHistory.create({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      variantSize: size || '',
      previousStock: prevStock,
      newStock: parseInt(newStock, 10),
      changeAmount: parseInt(newStock, 10) - prevStock,
      reason: reason || 'Manual stock adjustment',
      updatedBy: admin.userId as any,
      updatedByName: admin.name
    });

    return NextResponse.json({
      success: true,
      message: 'Inventory updated successfully',
      totalStock: product.totalStock
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
