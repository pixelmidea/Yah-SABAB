export const seedCategories = [
  {
    name: 'D-Tex Micro Stitch Panjabi',
    slug: 'd-tex-micro-stitch',
    description: 'প্রিমিয়াম চাইনা মাইক্রো স্টিচ ফেব্রিকের পাঞ্জাবি — সফট, লাইটওয়েট এবং টেকসই।',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
    displayOrder: 1
  },
  {
    name: 'China Popcorn Panjabi',
    slug: 'china-popcorn',
    description: 'প্রিমিয়াম চায়না পপকর্ন ফেব্রিক — ইউনিক টেক্সচার, এলিগেন্ট লুক ও আরামদায়ক অনুভূতি।',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop',
    displayOrder: 2
  },
  {
    name: 'Arabian Thobe & Kanduri',
    slug: 'arabian-thobe-kanduri',
    description: 'খাঁটি ওমানি ও অ্যারাবিয়ান স্টাইল থোব/কান্দুরা — প্রিমিয়াম ফিনিশিং ও সুন্নাহসম্মত আভিজাত্য।',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    displayOrder: 3
  },
  {
    name: 'Jeddah & Pepsi Cotton Thobe',
    slug: 'jeddah-pepsi-cotton',
    description: 'নরম পেপসি ও জেদ্দা কটন — গরমের দিনেও দেবে চরম প্রশান্তি ও স্বস্তি।',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=800&auto=format&fit=crop',
    displayOrder: 4
  },
  {
    name: 'Luxury Cotton Panjabi',
    slug: 'luxury-cotton',
    description: 'লাক্সারি কটন ফেব্রিক — ডার্ক চকলেট ও রয়েল শেডে নিখুঁত সেলাই ও এলিগেন্ট লুক।',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    displayOrder: 5
  }
];

export const seedProducts = [
  {
    name: 'D-Tex China Micro Stitch Panjabi - Royal Navy',
    slug: 'd-tex-china-micro-stitch-panjabi-royal-navy',
    sku: 'DTX-MIC-001',
    description: 'প্রিমিয়াম কোয়ালিটির ডি-টেক্স (D-Techs) চাইনা মাইক্রো স্টিচ ফেব্রিকের পাঞ্জাবি। অত্যন্ত সফট, লাইটওয়েট এবং টেকসই এই ফেব্রিক গরমে ও যেকোনো অনুষ্ঠানে পরার জন্য একদম পারফেক্ট। ১০০% কালার ও ফেব্রিক গ্যারান্টি। নিখুঁত সেলাই ও আরামদায়ক কাটিং।',
    price: 1850,
    discountPrice: 1450,
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Royal Navy', stock: 15, sku: 'DTX-MIC-001-M' },
      { size: 'L (42)', color: 'Royal Navy', stock: 20, sku: 'DTX-MIC-001-L' },
      { size: 'XL (44)', color: 'Royal Navy', stock: 10, sku: 'DTX-MIC-001-XL' }
    ],
    lowStockThreshold: 5,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tags: ['D-Tex', 'Micro Stitch', 'Panjabi', 'Eid Collection', 'Fixed Price'],
    rating: 5.0,
    numReviews: 38
  },
  {
    name: 'China Popcorn Panjabi - Elegant Off-White',
    slug: 'china-popcorn-panjabi-elegant-off-white',
    sku: 'POP-PUN-002',
    description: 'Upgrade your traditional look with our China Popcorn Panjabi. Crafted with premium China Popcorn fabric, soft & comfortable feel, with a clean textured finish. Perfect for Eid, Jummah & special occasions.',
    price: 1950,
    discountPrice: 1499,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Off-White', stock: 12, sku: 'POP-PUN-002-M' },
      { size: 'L (42)', color: 'Off-White', stock: 18, sku: 'POP-PUN-002-L' },
      { size: 'XL (44)', color: 'Off-White', stock: 8, sku: 'POP-PUN-002-XL' }
    ],
    lowStockThreshold: 4,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tags: ['China Popcorn', 'Panjabi', 'Jummah Special', 'Off-White'],
    rating: 4.9,
    numReviews: 29
  },
  {
    name: 'Jeddah Cotton Arabian Thobe - Pure White',
    slug: 'jeddah-cotton-arabian-thobe-pure-white',
    sku: 'JED-THB-003',
    description: 'আরাম, স্টাইল ও প্রিমিয়াম লুক—সব একসাথে! Premium Jeddah Cotton Fabric দিয়ে তৈরি Arabian Thobe Collection. সুন্দর ও ক্লিন ফিনিশিং, নরম, আরামদায়ক ও দৈনন্দিন ব্যবহার ও জুমার নামাজের জন্য উপযোগী।',
    price: 3000,
    discountPrice: 2450,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Pure White', stock: 10, sku: 'JED-THB-003-M' },
      { size: 'L (42)', color: 'Pure White', stock: 15, sku: 'JED-THB-003-L' },
      { size: 'XL (44)', color: 'Pure White', stock: 6, sku: 'JED-THB-003-XL' }
    ],
    lowStockThreshold: 5,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ['Jeddah Cotton', 'Arabian Thobe', 'Kanduri', 'White Thobe'],
    rating: 4.9,
    numReviews: 44
  },
  {
    name: 'Arabian Soft Pepsi Cotton Thobe (Royal Oman)',
    slug: 'arabian-soft-pepsi-cotton-thobe-royal-oman',
    sku: 'PEP-THB-004',
    description: 'Experience premium comfort with a classy Arabian look. Made with Soft Pepsi Cotton Fabric, imported Royal Oman quality. Super comfortable, breathable for hot weather, perfect for Jummah, Eid & everyday wear.',
    price: 2900,
    discountPrice: 2250,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Oman Sand', stock: 8, sku: 'PEP-THB-004-M' },
      { size: 'L (42)', color: 'Oman Sand', stock: 14, sku: 'PEP-THB-004-L' },
      { size: 'XL (44)', color: 'Oman Sand', stock: 5, sku: 'PEP-THB-004-XL' }
    ],
    lowStockThreshold: 4,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tags: ['Pepsi Cotton', 'Royal Oman', 'Arabian Thobe', 'Breathable'],
    rating: 4.8,
    numReviews: 21
  },
  {
    name: 'Luxury Cotton Fabric Panjabi - Dark Chocolate',
    slug: 'luxury-cotton-fabric-panjabi-dark-chocolate',
    sku: 'LUX-COT-005',
    description: 'স্টাইলের সাথে আরাম—দুটো একসাথে চাইলে এই পাঞ্জাবিটা আপনার পারফেক্ট চয়েস! প্রিমিয়াম কোয়ালিটির লাক্সারি কটন ফেব্রিক, নিখুঁত সেলাই ও ফিনিশিং। “If you love the Messenger of Allah ﷺ, then build your life through the Sunnah.”',
    price: 2400,
    discountPrice: 1850,
    images: [
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Dark Chocolate', stock: 12, sku: 'LUX-COT-005-M' },
      { size: 'L (42)', color: 'Dark Chocolate', stock: 16, sku: 'LUX-COT-005-L' },
      { size: 'XL (44)', color: 'Dark Chocolate', stock: 7, sku: 'LUX-COT-005-XL' }
    ],
    lowStockThreshold: 5,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    tags: ['Luxury Cotton', 'Dark Chocolate', 'Sunnah Fashion', 'Panjabi'],
    rating: 5.0,
    numReviews: 31
  },
  {
    name: 'Omani Special Summer Thobe (Authentic Kanduri)',
    slug: 'omani-special-summer-thobe-authentic-kanduri',
    sku: 'OMN-THB-006',
    description: 'Soft and smooth fabric with authentic Omani styling. 100% Summer friendly, lightweight & comfortable. Straight import look with signature tassel detail.',
    price: 1650,
    discountPrice: 1250,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Desert Beige', stock: 10, sku: 'OMN-THB-006-M' },
      { size: 'L (42)', color: 'Desert Beige', stock: 12, sku: 'OMN-THB-006-L' },
      { size: 'XL (44)', color: 'Desert Beige', stock: 5, sku: 'OMN-THB-006-XL' }
    ],
    lowStockThreshold: 4,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ['Omani Kanduri', 'Thobe', 'Summer Friendly', 'Offer Price'],
    rating: 4.7,
    numReviews: 17
  },
  {
    name: 'D-Tex Micro Stitch Panjabi - Jet Black Edition',
    slug: 'd-tex-micro-stitch-panjabi-jet-black-edition',
    sku: 'DTX-MIC-007',
    description: 'D-Techs China Micro Stitch fabric in deep jet black. সুক্ষ্ম ও নিখুঁত স্টিচ ওয়ার্ক, মার্জিত এবং এলিগেন্ট লুক। ধোয়ার পরও কাপড়ের উজ্জ্বলতা ও সাইজ একই থাকবে।',
    price: 1850,
    discountPrice: 1450,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Jet Black', stock: 14, sku: 'DTX-MIC-007-M' },
      { size: 'L (42)', color: 'Jet Black', stock: 20, sku: 'DTX-MIC-007-L' },
      { size: 'XL (44)', color: 'Jet Black', stock: 9, sku: 'DTX-MIC-007-XL' }
    ],
    lowStockThreshold: 5,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ['D-Tex', 'Jet Black', 'Micro Stitch', 'Panjabi'],
    rating: 4.9,
    numReviews: 26
  },
  {
    name: 'China Popcorn Panjabi - Olive Green Special',
    slug: 'china-popcorn-panjabi-olive-green-special',
    sku: 'POP-PUN-008',
    description: 'China Popcorn textured fabric in rich olive green. Soft, comfortable & breathable. Premium stitching & finishing for celebrations and gatherings.',
    price: 1950,
    discountPrice: 1699,
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop'
    ],
    variants: [
      { size: 'M (40)', color: 'Olive Green', stock: 11, sku: 'POP-PUN-008-M' },
      { size: 'L (42)', color: 'Olive Green', stock: 15, sku: 'POP-PUN-008-L' },
      { size: 'XL (44)', color: 'Olive Green', stock: 6, sku: 'POP-PUN-008-XL' }
    ],
    lowStockThreshold: 4,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ['China Popcorn', 'Olive Green', 'Special Offer', 'Panjabi'],
    rating: 4.8,
    numReviews: 15
  }
];

export const seedCoupons = [
  {
    code: 'YAH2026',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 2000,
    maxDiscountAmount: 500,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 500,
    isActive: true
  },
  {
    code: 'SUNNAH100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 1450,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 1000,
    isActive: true
  }
];
