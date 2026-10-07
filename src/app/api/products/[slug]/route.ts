import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    // Query either by slug or by ObjectId
    let query: any = { slug };
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    const product = await Product.findOne(query).populate('category', 'name slug').lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch approved customer reviews
    const reviews = await Review.find({ product: product._id, isApproved: true })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch related products from same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .lean();

    return NextResponse.json({
      success: true,
      product,
      reviews,
      relatedProducts
    });
  } catch (error: any) {
    console.error('Fetch Single Product Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin authorization required' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const body = await req.json();

    await connectToDatabase();

    let query: any = { slug };
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    const existingProduct = await Product.findOne(query);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (body.name && body.name !== existingProduct.name) {
      body.slug = slugify(body.name);
    }

    if (body.variants && body.variants.length > 0) {
      body.totalStock = body.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      existingProduct._id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error: any) {
    console.error('Update Product Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin authorization required' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    await connectToDatabase();

    let query: any = { slug };
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    // Instead of raw deletion, soft deactivate or delete
    const product = await Product.findOne(query);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false as per prompt safety guidelines
    product.isActive = false;
    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product archived successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error deleting product' },
      { status: 500 }
    );
  }
}
