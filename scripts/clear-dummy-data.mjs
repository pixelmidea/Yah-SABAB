import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;

async function run() {
  if (!uri) {
    console.error('Error: MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('Connected to database:', mongoose.connection.name);

  const db = mongoose.connection.db;

  const productCount = await db.collection('products').countDocuments();
  const orderCount = await db.collection('orders').countDocuments();

  console.log(`Found ${productCount} existing products, ${orderCount} sample orders.`);

  // Clear products
  await db.collection('products').deleteMany({});
  console.log(' Cleared all dummy products.');

  // Clear orders
  await db.collection('orders').deleteMany({});
  console.log(' Cleared all sample orders.');

  console.log('\n Catalog is now clean and ready for real Panjabi products and photos!');
  console.log('Admin can now add real products at http://localhost:3000/admin/products');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Clear failed:', err.message);
  process.exit(1);
});
