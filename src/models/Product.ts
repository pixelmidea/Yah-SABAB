import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant {
  _id?: string;
  size?: string;  // e.g. M, L, XL, XXL, 40, 42, 44
  color?: string; // e.g. White, Black, Navy, Maroon
  stock: number;
  sku?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  variants: IProductVariant[];
  totalStock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  tags: string[];
  rating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IProductVariant>({
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, default: '' }
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    sku: { type: String, required: true, unique: true, index: true, uppercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: [{ type: String, required: true }],
    variants: [VariantSchema],
    totalStock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Calculate total stock from variants before saving if variants exist
ProductSchema.pre('save', function (this: IProduct) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
});

// Indexes for fast searching & filtering
ProductSchema.index({ name: 'text', description: 'text', tags: 'text', sku: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ category: 1, isActive: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
