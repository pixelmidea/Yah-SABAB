import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import StoreSettings from '@/models/StoreSettings';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await StoreSettings.findOne().lean();

    if (!settings) {
      settings = await StoreSettings.create({});
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin authorization required' }, { status: 403 });
    }

    const body = await req.json();
    await connectToDatabase();

    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Store settings updated successfully',
      settings
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
