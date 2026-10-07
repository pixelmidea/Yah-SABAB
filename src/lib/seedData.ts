export const seedCategories = [
  {
    name: 'Panjabi',
    slug: 'panjabi',
    description: 'Premium embroidered & cotton Panjabis crafted for elegance and everyday wear.',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    displayOrder: 1
  },
  {
    name: 'Kabli Suit',
    slug: 'kabli-suit',
    description: 'Traditional Afghani & Peshawari styled Kabli sets with matching trousers.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    displayOrder: 2
  },
  {
    name: 'Pajama & Aligarh',
    slug: 'pajama',
    description: 'Cotton Pajamas, Aligarh cut, and Chudidar trousers for men.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    displayOrder: 3
  },
  {
    name: 'Exclusive Combo',
    slug: 'combo',
    description: 'Matched Panjabi, Pajama & Koti/Waistcoat sets for special celebrations.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    displayOrder: 4
  },
  {
    name: 'Koti & Waistcoat',
    slug: 'koti',
    description: 'Structured jacquard & velvet waistcoats to complement your outfit.',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=800&auto=format&fit=crop',
    displayOrder: 5
  }
];

export const seedProducts = [
  {
    name: 'Royal Midnight Blue Embroidered Cotton Panjabi',
    slug: 'royal-midnight-blue-embroidered-cotton-panjabi',
    sku: 'PAN-BLU-001',
    description: 'Crafted from 100% long-staple Egyptian cotton with meticulous neckline thread embroidery and custom metallic buttons. Designed for Eid and festive gatherings with high breathability.',
    price: 3450,
    discountPrice: 2950,
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Midnight Blue', stock: 12, sku: 'PAN-BLU-001-M' },
      { size: 'L (42)', color: 'Midnight Blue', stock: 18, sku: 'PAN-BLU-001-L' },
      { size: 'XL (44)', color: 'Midnight Blue', stock: 8, sku: 'PAN-BLU-001-XL' },
      { size: 'XXL (46)', color: 'Midnight Blue', stock: 3, sku: 'PAN-BLU-001-XXL' }
    ],
    lowStockThreshold: 5,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tags: ['Embroidered', 'Cotton', 'Eid Collection', 'Festive'],
    rating: 4.9,
    numReviews: 28
  },
  {
    name: 'Classic Off-White Jacquard Silk Fusion Panjabi',
    slug: 'classic-off-white-jacquard-silk-fusion-panjabi',
    sku: 'PAN-WHT-002',
    description: 'A timeless off-white jacquard woven Panjabi featuring subtle tone-on-tone pattern, comfortable band collar, and concealed placket. Perfect for weddings, Jummah, and formal events.',
    price: 3850,
    discountPrice: 3250,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Off-White', stock: 15, sku: 'PAN-WHT-002-M' },
      { size: 'L (42)', color: 'Off-White', stock: 20, sku: 'PAN-WHT-002-L' },
      { size: 'XL (44)', color: 'Off-White', stock: 10, sku: 'PAN-WHT-002-XL' },
      { size: 'XXL (46)', color: 'Off-White', stock: 4, sku: 'PAN-WHT-002-XXL' }
    ],
    lowStockThreshold: 5,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tags: ['Jacquard', 'Silk', 'Wedding', 'Formal'],
    rating: 4.8,
    numReviews: 19
  },
  {
    name: 'Emerald Green Heritage Collar Panjabi Set',
    slug: 'emerald-green-heritage-collar-panjabi-set',
    sku: 'PAN-GRN-003',
    description: 'Deep emerald green Panjabi tailored with premium fine-count blended fabric. Features contrast maroon stitching along sleeve cuffs and collar with snap fastener closure.',
    price: 2750,
    discountPrice: 2350,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Emerald Green', stock: 6, sku: 'PAN-GRN-003-M' },
      { size: 'L (42)', color: 'Emerald Green', stock: 14, sku: 'PAN-GRN-003-L' },
      { size: 'XL (44)', color: 'Emerald Green', stock: 2, sku: 'PAN-GRN-003-XL' }
    ],
    lowStockThreshold: 5,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ['Green', 'Cotton', 'Festive'],
    rating: 4.7,
    numReviews: 14
  },
  {
    name: 'Peshawari Black Kabli Suit with Matching Trousers',
    slug: 'peshawari-black-kabli-suit-with-matching-trousers',
    sku: 'KAB-BLK-004',
    description: 'Traditional Peshawari cut Kabli suit featuring heavy drape fabric, deep side pockets, and wide flared sleeves. Comes complete with tailored matching salwar trousers.',
    price: 4500,
    discountPrice: 3950,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Jet Black', stock: 8, sku: 'KAB-BLK-004-M' },
      { size: 'L (42)', color: 'Jet Black', stock: 11, sku: 'KAB-BLK-004-L' },
      { size: 'XL (44)', color: 'Jet Black', stock: 5, sku: 'KAB-BLK-004-XL' },
      { size: 'XXL (46)', color: 'Jet Black', stock: 2, sku: 'KAB-BLK-004-XXL' }
    ],
    lowStockThreshold: 4,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    tags: ['Kabli', 'Salwar', 'Black', 'Peshawari'],
    rating: 5.0,
    numReviews: 32
  },
  {
    name: 'Maroon Velvet Embossed Festive Koti Waistcoat',
    slug: 'maroon-velvet-embossed-festive-koti-waistcoat',
    sku: 'KOT-MAR-005',
    description: 'Royal maroon velvet Koti with subtle golden metal buttons, double welt pockets, and adjustable back cinch slider. Instantly elevates any solid white or black Panjabi.',
    price: 2450,
    discountPrice: 1990,
    images: [
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (38)', color: 'Royal Maroon', stock: 5, sku: 'KOT-MAR-005-M' },
      { size: 'L (40)', color: 'Royal Maroon', stock: 9, sku: 'KOT-MAR-005-L' },
      { size: 'XL (42)', color: 'Royal Maroon', stock: 3, sku: 'KOT-MAR-005-XL' }
    ],
    lowStockThreshold: 3,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ['Koti', 'Waistcoat', 'Velvet', 'Maroon'],
    rating: 4.6,
    numReviews: 9
  },
  {
    name: 'Premium Pure Cotton White Aligarh Pajama',
    slug: 'premium-pure-cotton-white-aligarh-pajama',
    sku: 'PAJ-WHT-006',
    description: '100% combed cotton Aligarh cut pajama featuring straight leg fit, soft elastic waistband with drawstring, and side seam pockets. Breathable and comfortable.',
    price: 990,
    discountPrice: 850,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (38)', color: 'White', stock: 25, sku: 'PAJ-WHT-006-M' },
      { size: 'L (40)', color: 'White', stock: 30, sku: 'PAJ-WHT-006-L' },
      { size: 'XL (42)', color: 'White', stock: 15, sku: 'PAJ-WHT-006-XL' },
      { size: 'XXL (44)', color: 'White', stock: 10, sku: 'PAJ-WHT-006-XXL' }
    ],
    lowStockThreshold: 10,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    tags: ['Pajama', 'Cotton', 'Aligarh', 'White'],
    rating: 4.9,
    numReviews: 45
  }
];

export const seedCoupons = [
  {
    code: 'EID20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 2000,
    maxDiscountAmount: 1000,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 500,
    isActive: true
  },
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscountAmount: 500,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 1000,
    isActive: true
  },
  {
    code: 'FLAT300',
    discountType: 'fixed',
    discountValue: 300,
    minOrderAmount: 3000,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 200,
    isActive: true
  }
];
