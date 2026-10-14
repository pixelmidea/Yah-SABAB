import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Notification from '@/models/Notification';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const authUser = getAuthUser(req);
    const searchParams = req.nextUrl.searchParams;
    const requestedRole = searchParams.get('role');

    const isAdmin = authUser?.role === 'admin' || requestedRole === 'admin';

    let query: any = {};

    if (isAdmin) {
      // Admin sees notifications targeted to admin or all (or legacy without target)
      query = {
        $or: [
          { target: { $in: ['admin', 'all'] } },
          { target: { $exists: false } }
        ]
      };
    } else if (authUser?.userId) {
      // Customer sees their notifications or general customer announcements
      query = {
        $or: [
          { target: 'all' },
          { target: 'customer', user: authUser.userId },
          { target: 'customer', user: { $exists: false } }
        ]
      };
    } else {
      // Guest customer on storefront
      query = {
        $or: [
          { target: 'all' },
          { target: 'customer', user: { $exists: false } }
        ]
      };
    }

    // Fetch latest 30 notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      role: isAdmin ? 'admin' : 'customer'
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const authUser = getAuthUser(req);
    const body = await req.json();
    const { action, target } = body;

    if (action === 'mark_all_read') {
      const isAdmin = authUser?.role === 'admin' || target === 'admin';
      const filter = isAdmin
        ? { target: { $in: ['admin', 'all'] }, isRead: false }
        : authUser?.userId
        ? {
            $or: [
              { user: authUser.userId },
              { target: { $in: ['customer', 'all'] } }
            ],
            isRead: false
          }
        : { target: { $in: ['customer', 'all'] }, isRead: false };

      await Notification.updateMany(filter as any, { $set: { isRead: true } });

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { title, message, type, target, link, metadata, userId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const newNotif = await Notification.create({
      title: title.trim(),
      message: message.trim(),
      type: type || 'system',
      target: target || 'admin',
      link: link || '',
      user: userId || undefined,
      metadata: metadata || undefined,
      isRead: false
    });

    return NextResponse.json({
      success: true,
      notification: newNotif
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create notification' },
      { status: 500 }
    );
  }
}
