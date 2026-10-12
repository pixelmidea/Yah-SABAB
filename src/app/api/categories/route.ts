import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    await connectToDatabase();
    let categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).lean();

    // If database was freshly cleared or empty, initialize standard Panjabi categories automatically
    if (categories.length === 0) {
      const defaultCats = [
        {
          name: 'D-Tex Micro Stitch Panjabi',
          slug: 'd-tex-micro-stitch',
          description: 'প্রিমিয়াম চাইনা মাইক্রো স্টিচ ফেব্রিক — সফট, লাইটওয়েট এবং টেকসই।',
          image: '/hero-bg.jpg',
          displayOrder: 1,
          isActive: true
        },
        {
          name: 'China Popcorn Panjabi',
          slug: 'china-popcorn',
          description: 'প্রিমিয়াম চায়না পপকর্ন ফেব্রিক — ইউনিক টেক্সচার ও এলিগেন্ট লুক।',
          image: '/hero-bg.jpg',
          displayOrder: 2,
          isActive: true
        },
        {
          name: 'Arabian Thobe & Kanduri',
          slug: 'arabian-thobe-kanduri',
          description: 'খাঁটি ওমানি ও অ্যারাবিয়ান স্টাইল থোব/কান্দুরা — প্রিমিয়াম ফিনিশিং।',
          image: '/hero-bg.jpg',
          displayOrder: 3,
          isActive: true
        },
        {
          name: 'Royal Pepsi Cotton',
          slug: 'jeddah-pepsi-cotton',
          description: 'আমদানিকৃত পেপসি কটন — আরামদায়ক ও দীর্ঘস্থায়ী কোয়ালিটি।',
          image: '/hero-bg.jpg',
          displayOrder: 4,
          isActive: true
        }
      ];
      await Category.insertMany(defaultCats);
      categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).lean();
    }

    return NextResponse.json({ success: true, categories });
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

    const { name, description, image, displayOrder } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    await connectToDatabase();
    const slug = slugify(name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
      image: image || '',
      displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0
    });

    return NextResponse.json({ success: true, message: 'Category created', category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
