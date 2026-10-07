import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Bangladeshi Taka (BDT ৳)
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '৳0';
  }
  return `৳${Math.round(amount).toLocaleString('en-BD')}`;
}

/**
 * Validate Bangladesh phone number format
 * Accepts: 01712345678, +8801712345678, 8801712345678
 */
export function validateBDPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.trim().replace(/\s+|-/g, '');
  const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
  return bdPhoneRegex.test(cleanPhone);
}

/**
 * Normalize Bangladesh phone number to 11 digit format (017xxxxxxxx)
 */
export function normalizeBDPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleanPhone = phone.trim().replace(/\s+|-/g, '');
  const match = cleanPhone.match(/(01[3-9]\d{8})$/);
  return match ? match[1] : cleanPhone;
}

/**
 * Generate SEO-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}
