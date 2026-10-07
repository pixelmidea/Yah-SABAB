import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size') || '';
    const sort = searchParams.get('sort') || 'newest';
    const isFeatured = searchParams.get('isFeatured');
    const isNewArrival = searchParams.get('isNewArrival');
    const isBestSeller = searchParams.get('isBestSeller');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const filter: any = { isActive: true };

    // Text search query
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { tags: searchRegex },
        { description: searchRegex }
      ];
    }

    // Category filter
    if (categorySlug && categorySlug !== 'all') {
      const categoryDoc = await Category.findOne({ slug: categorySlug });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        // If category object ID passed directly
        if (categorySlug.match(/^[0-9a-fA-F]{24}$/)) {
          filter.category = categorySlug;
        }
      }
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Size filter
    if (size) {
      filter['variants.size'] = new RegExp(size, 'i');
    }

    // Featured / Badges
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isNewArrival === 'true') filter.isNewArrival = true;
    if (isBestSeller === 'true') filter.isBestSeller = true;

    // Sorting
    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'popular') sortOptions = { numReviews: -1, rating: -1 };
    if (sort === 'best-rated') sortOptions = { rating: -1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin authorization required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      sku,
      description,
      price,
      discountPrice,
      category,
      images,
      variants,
      lowStockThreshold,
      isFeatured,
      isNewArrival,
      isBestSeller,
      tags
    } = body;

    if (!name || !sku || !description || !price || !category || !images || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all mandatory product fields (Name, SKU, Description, Price, Category, Images)' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug = slugify(name);
    const existingSku = await Product.findOne({ sku: sku.toUpperCase().trim() });
    if (existingSku) {
      return NextResponse.json(
        { success: false, error: `Product SKU "${sku}" already exists` },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: name.trim(),
      slug,
      sku: sku.toUpperCase().trim(),
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      category,
      images,
      variants: variants || [],
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold, 10) : 5,
      isFeatured: !!isFeatured,
      isNewArrival: !!isNewArrival,
      isBestSeller: !!isBestSeller,
      tags: tags || []
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error: any) {
    console.error('Create Product Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
