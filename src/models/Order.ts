import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderStatus =
  | 'Pending'
  | 'Payment Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type PaymentStatus =
  | 'Unpaid'
  | 'Payment Pending'
  | 'Payment Verified'
  | 'Payment Rejected'
  | 'Refunded';

export type PaymentMethod = 'COD' | 'bKash' | 'Nagad' | 'Rocket';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  sku?: string;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  area: string;
  address: string;
}

export interface IPaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  senderNumber?: string;
  transactionId?: string;
  amountPaid?: number;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
}

export interface IStatusHistoryItem {
  status: OrderStatus;
  note?: string;
  updatedAt: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentInfo: IPaymentInfo;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  deliveryFee: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  statusHistory: IStatusHistoryItem[];
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  sku: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 }
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  district: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String, required: true }
});

const PaymentInfoSchema = new Schema<IPaymentInfo>({
  method: {
    type: String,
    enum: ['COD', 'bKash', 'Nagad', 'Rocket'],
    required: true
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Payment Pending', 'Payment Verified', 'Payment Rejected', 'Refunded'],
    default: 'Unpaid'
  },
  senderNumber: { type: String, default: '' },
  transactionId: { type: String, default: '' },
  amountPaid: { type: Number, default: 0 },
  verifiedAt: { type: Date },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String, default: '' }
});

const StatusHistorySchema = new Schema<IStatusHistoryItem>({
  status: { type: String, required: true },
  note: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    paymentInfo: PaymentInfoSchema,
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    deliveryFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Payment Pending',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
        'Refunded'
      ],
      default: 'Pending',
      index: true
    },
    statusHistory: [StatusHistorySchema],
    internalNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'shippingAddress.phone': 1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
