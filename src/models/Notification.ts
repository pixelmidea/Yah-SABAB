import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'review' | 'system' | 'promo';
  target: 'admin' | 'customer' | 'all';
  user?: mongoose.Types.ObjectId;
  link?: string;
  isRead: boolean;
  metadata?: any;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['order', 'payment', 'stock', 'review', 'system', 'promo'],
      default: 'order'
    },
    target: {
      type: String,
      enum: ['admin', 'customer', 'all'],
      default: 'admin'
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Refresh model schema during development hot-reloading
if (process.env.NODE_ENV !== 'production' && mongoose.models.Notification) {
  delete (mongoose.models as any).Notification;
}

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
