import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { hashPassword } from '@/lib/auth';
import { normalizeBDPhoneNumber, validateBDPhoneNumber } from '@/lib/utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const orders = await Order.find({ user: id })
      .sort({ createdAt: -1 })
      .select('orderNumber totalAmount orderStatus paymentInfo createdAt shippingAddress')
      .lean();

    return NextResponse.json({
      success: true,
      user,
      orders
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const { name, email, phone, role, isActive, division, district, city, notes, password } = body;

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (phone) {
      if (!validateBDPhoneNumber(phone)) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid Bangladesh phone number' },
          { status: 400 }
        );
      }
      user.phone = normalizeBDPhoneNumber(phone);
    }
    if (role && ['customer', 'admin', 'staff'].includes(role)) {
      user.role = role;
    }
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }
    if (division) user.division = division.trim();
    if (district !== undefined) user.district = district.trim();
    if (city !== undefined) user.city = city.trim();
    if (notes !== undefined) user.notes = notes.trim();

    if (password && password.length >= 6) {
      user.password = await hashPassword(password);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        division: user.division,
        district: user.district,
        city: user.city,
        notes: user.notes,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User removed successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
