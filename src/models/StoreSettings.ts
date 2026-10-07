import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreSettings extends Document {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  logoUrl?: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeShippingThreshold?: number;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  codAvailable: boolean;
  minOrderValue: number;
  announcementBarText: string;
  showAnnouncementBar: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: 'Yah SABAB' },
    tagline: { type: String, default: 'Heritage & Modern Elegance for Men' },
    phone: { type: String, default: '01700000000' },
    email: { type: String, default: 'support@yahsabab.com' },
    address: { type: String, default: 'Banani, Road 11, Dhaka-1213, Bangladesh' },
    logoUrl: { type: String, default: '/logo.png' },
    insideDhakaFee: { type: Number, default: 80 },
    outsideDhakaFee: { type: Number, default: 130 },
    freeShippingThreshold: { type: Number, default: 3500 },
    bkashNumber: { type: String, default: '01712345678' },
    nagadNumber: { type: String, default: '01812345678' },
    rocketNumber: { type: String, default: '01912345678' },
    codAvailable: { type: Boolean, default: true },
    minOrderValue: { type: Number, default: 0 },
    announcementBarText: { type: String, default: '✨ FREE Shipping across Bangladesh on orders over ৳3,500! Express Cash on Delivery & bKash available.' },
    showAnnouncementBar: { type: Boolean, default: true },
    facebookUrl: { type: String, default: 'https://facebook.com' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    youtubeUrl: { type: String, default: 'https://youtube.com' }
  },
  { timestamps: true }
);

const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);

export default StoreSettings;
