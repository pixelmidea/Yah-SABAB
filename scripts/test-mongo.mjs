import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
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

console.log('Testing connection to MongoDB Atlas...');
console.log('URI:', uri ? uri.replace(/:([^@]+)@/, ':****@') : 'UNDEFINED');

if (!uri) {
  console.error('Error: MONGODB_URI is not set in .env.local');
  process.exit(1);
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('\n SUCCESS: Connected to MongoDB Atlas cluster successfully!');
  console.log('Database name:', mongoose.connection.name);
  console.log('Ready state:', mongoose.connection.readyState);
  await mongoose.disconnect();
  console.log('Disconnected cleanly.');
  process.exit(0);
} catch (error) {
  console.error('\n CONNECTION FAILED:');
  console.error(error.message);
  console.log('\n Action needed in MongoDB Atlas:');
  console.log('1. Go to https://cloud.mongodb.com');
  console.log('2. Click on "Network Access" under Security in the left sidebar.');
  console.log('3. Click "Add IP Address" -> choose "Allow Access from Anywhere" (0.0.0.0/0) or add your current IP.');
  console.log('4. Click Confirm and wait ~1 minute for Atlas to apply.');
  process.exit(1);
}
