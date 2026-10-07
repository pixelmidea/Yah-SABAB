import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInventoryHistory extends Document {
  product: mongoose.Types.ObjectId;
  productName: string;
  sku?: string;
  variantSize?: string;
  variantColor?: string;
  previousStock: number;
  newStock: number;
  changeAmount: number;
  reason: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;
  createdAt: Date;
}

const InventoryHistorySchema = new Schema<IInventoryHistory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    productName: { type: String, required: true },
    sku: { type: String, default: '' },
    variantSize: { type: String, default: '' },
    variantColor: { type: String, default: '' },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    changeAmount: { type: Number, required: true },
    reason: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedByName: { type: String, default: 'System' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const InventoryHistory: Model<IInventoryHistory> =
  mongoose.models.InventoryHistory || mongoose.model<IInventoryHistory>('InventoryHistory', InventoryHistorySchema);

export default InventoryHistory;
