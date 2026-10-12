import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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

  // 1. Ensure Admin User
  const usersCollection = db.collection('users');
  const adminEmail = 'admin@yahsabab.com';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin@123456', salt);

  const existingAdmin = await usersCollection.findOne({ email: adminEmail });
  if (existingAdmin) {
    await usersCollection.updateOne(
      { email: adminEmail },
      {
        $set: {
          password: hashedPassword,
          role: 'admin',
          isActive: true
        }
      }
    );
    console.log(` Admin user (${adminEmail}) updated with password: Admin@123456`);
  } else {
    await usersCollection.insertOne({
      name: 'Yah SABAB Admin',
      email: adminEmail,
      phone: '+96878343923',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(` Admin user created: ${adminEmail} (password: Admin@123456)`);
  }

  // 2. Ensure Store Settings
  const settingsCollection = db.collection('storesettings');
  const existingSettings = await settingsCollection.findOne({});
  if (!existingSettings) {
    await settingsCollection.insertOne({
      storeName: 'Yah SABAB (Arabic Kanduri & Panjabi)',
      tagline: 'Style, Comfort & Elegance! | আপনার আভিজাত্যের বিশ্বস্ত ঠিকানা',
      phone: '+96878343923',
      email: 'support@yahsabab.com',
      address: 'Dhaka, Bangladesh',
      logoUrl: '/logo.png',
      insideDhakaFee: 115,
      outsideDhakaFee: 130,
      freeShippingThreshold: 5000,
      bkashNumber: '01711002233',
      nagadNumber: '01811002233',
      rocketNumber: '01911002233',
      codAvailable: true,
      minOrderValue: 0,
      announcementBarText: '✨ YAH SABAB — Style, Comfort & Elegance | সারা দেশে ক্যাশ অন ডেলিভারি | WhatsApp: +96878343923',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(' Default StoreSettings initialized.');
  }

  // 3. Ensure Default Categories
  const categoriesCollection = db.collection('categories');
  const catCount = await categoriesCollection.countDocuments();
  if (catCount === 0) {
    const defaultCats = [
      {
        name: 'D-Tex Micro Stitch Panjabi',
        slug: 'd-tex-micro-stitch',
        description: 'প্রিমিয়াম চাইনা মাইক্রো স্টিচ ফেব্রিক — সফট, লাইটওয়েট এবং টেকসই।',
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800',
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'China Popcorn Panjabi',
        slug: 'china-popcorn',
        description: 'প্রিমিয়াম চায়না পপকর্ন ফেব্রিক — ইউনিক টেক্সচার ও এলিগেন্ট লুক।',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800',
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Arabian Thobe & Kanduri',
        slug: 'arabian-thobe-kanduri',
        description: 'খাঁটি ওমানি ও অ্যারাবিয়ান স্টাইল থোব/কান্দুরা — প্রিমিয়াম ফিনিশিং।',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Royal Pepsi Cotton',
        slug: 'jeddah-pepsi-cotton',
        description: 'আমদানিকৃত পেপসি কটন — আরামদায়ক ও দীর্ঘস্থায়ী কোয়ালিটি।',
        image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800',
        displayOrder: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await categoriesCollection.insertMany(defaultCats);
    console.log(` Created ${defaultCats.length} default Panjabi categories.`);
  }

  await mongoose.disconnect();
  console.log('\n Setup complete! Admin can log in at http://localhost:3000/auth/login');
  process.exit(0);
}

run().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
