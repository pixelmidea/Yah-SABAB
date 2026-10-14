import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { hashPassword, getAuthUser } from '@/lib/auth';
import { normalizeBDPhoneNumber, validateBDPhoneNumber } from '@/lib/utils';

// Helper to determine division from district name if division is missing
function guessDivision(district?: string): string {
  if (!district) return 'Dhaka';
  const d = district.toLowerCase();
  if (d.includes('dhaka') || d.includes('gazipur') || d.includes('narayanganj') || d.includes('tangail') || d.includes('faridpur') || d.includes('banani') || d.includes('gulshan') || d.includes('dhanmondi') || d.includes('mirpur') || d.includes('uttara')) return 'Dhaka';
  if (d.includes('chittagong') || d.includes('chattogram') || d.includes('cox') || d.includes('comilla') || d.includes('noakhali') || d.includes('feni') || d.includes('chandpur')) return 'Chittagong';
  if (d.includes('sylhet') || d.includes('moulvibazar') || d.includes('habiganj') || d.includes('sunamganj')) return 'Sylhet';
  if (d.includes('rajshahi') || d.includes('bogra') || d.includes('pabna') || d.includes('naogaon') || d.includes('natore') || d.includes('sirajganj')) return 'Rajshahi';
  if (d.includes('khulna') || d.includes('jessore') || d.includes('kushtia') || d.includes('satkhira') || d.includes('bagerhat')) return 'Khulna';
  if (d.includes('barisal') || d.includes('bhola') || d.includes('patuakhali') || d.includes('pirojpur')) return 'Barisal';
  if (d.includes('rangpur') || d.includes('dinajpur') || d.includes('kurigram') || d.includes('lalmonirhat') || d.includes('panchagarh')) return 'Rangpur';
  if (d.includes('mymensingh') || d.includes('jamalpur') || d.includes('netrokona') || d.includes('sherpur')) return 'Mymensingh';
  return 'Dhaka';
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // 1. Fetch all users
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // 2. Aggregate order lifetime statistics per user
    const userOrderStats = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          latestOrderDate: { $max: '$createdAt' },
          shippingDistricts: { $addToSet: '$shippingAddress.district' }
        }
      }
    ]);

    const statsMap = new Map();
    userOrderStats.forEach((stat) => {
      if (stat._id) {
        statsMap.set(stat._id.toString(), stat);
      }
    });

    // 3. Build enriched user profiles
    const divisionCounts: Record<string, number> = {
      Dhaka: 0,
      Chittagong: 0,
      Sylhet: 0,
      Rajshahi: 0,
      Khulna: 0,
      Barisal: 0,
      Rangpur: 0,
      Mymensingh: 0
    };

    const enrichedUsers = users.map((u: any) => {
      const stats = statsMap.get(u._id.toString()) || {
        totalOrders: 0,
        totalSpent: 0,
        latestOrderDate: null,
        shippingDistricts: []
      };

      // Resolve user division
      let userDivision = u.division;
      if (!userDivision || userDivision.trim() === '') {
        const orderDistrict = stats.shippingDistricts && stats.shippingDistricts[0];
        const addrDistrict = u.addresses && u.addresses[0] && u.addresses[0].district;
        userDivision = guessDivision(orderDistrict || addrDistrict || u.district);
      }

      // Track division demographic count
      if (divisionCounts[userDivision] !== undefined) {
        divisionCounts[userDivision]++;
      } else {
        divisionCounts['Dhaka']++;
      }

      return {
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role || 'customer',
        isActive: u.isActive !== false,
        division: userDivision,
        district: u.district || (u.addresses && u.addresses[0]?.district) || '',
        city: u.city || (u.addresses && u.addresses[0]?.area) || '',
        notes: u.notes || '',
        totalOrders: stats.totalOrders || 0,
        totalSpent: stats.totalSpent || 0,
        latestOrderDate: stats.latestOrderDate || null,
        lastLogin: u.lastLogin || null,
        createdAt: u.createdAt,
        addresses: u.addresses || []
      };
    });

    return NextResponse.json({
      success: true,
      users: enrichedUsers,
      totalCount: enrichedUsers.length,
      demographics: {
        divisions: divisionCounts,
        roles: {
          admin: enrichedUsers.filter((u) => u.role === 'admin').length,
          staff: enrichedUsers.filter((u) => u.role === 'staff').length,
          customer: enrichedUsers.filter((u) => u.role === 'customer').length
        },
        activeCount: enrichedUsers.filter((u) => u.isActive).length,
        buyersCount: enrichedUsers.filter((u) => u.totalOrders > 0).length
      }
    });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role, division, district, city, notes } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and contact number are required' },
        { status: 400 }
      );
    }

    if (!validateBDPhoneNumber(phone)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid Bangladesh contact number (e.g. 01712345678)' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = normalizeBDPhoneNumber(phone);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A user account with this email already exists' },
        { status: 400 }
      );
    }

    // Default password if not specified by admin
    const rawPassword = password && password.length >= 6 ? password : 'YahSabab@2026';
    const hashedPassword = await hashPassword(rawPassword);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role: role || 'customer',
      division: division?.trim() || 'Dhaka',
      district: district?.trim() || '',
      city: city?.trim() || '',
      notes: notes?.trim() || '',
      isActive: true,
      lastLogin: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        division: newUser.division,
        district: newUser.district,
        city: newUser.city,
        notes: newUser.notes,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
        totalOrders: 0,
        totalSpent: 0
      }
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
