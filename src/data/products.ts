import { Product } from '../types';

export const HERO_IMAGE = '/src/assets/images/everly_wayward_hero_1784199331510.jpg';

export const PRODUCTS: Product[] = [
  // --- WOMEN'S COLLECTION ---
  {
    id: 'w-1',
    name: 'Aurelia Cashmere Knit Sweater',
    price: 185,
    category: 'women',
    collection: 'Cozy Knitwear',
    images: [
      'https://images.unsplash.com/photo-1574164904299-3a102b110380?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'An exceptionally soft knit made from 100% sustainably sourced Mongolian cashmere. Designed with a slightly relaxed silhouette, elegant ribbed trims, and a timeless crew neckline, the Aurelia offers refined comfort that elevates any outfit.',
    details: [
      '100% Grade-A Mongolian Cashmere',
      'Ribbed collar, cuffs, and hem',
      'Hypoallergenic and exceptionally lightweight yet warm',
      'Dry clean or hand wash cold, lay flat to dry'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Milk', hex: '#E5DCD3' },
      { name: 'Charcoal Mist', hex: '#3E4142' },
      { name: 'Desert Sage', hex: '#9CA699' }
    ],
    rating: 4.9,
    reviewsCount: 142,
    isBestSeller: true
  },
  {
    id: 'w-2',
    name: 'Wanderlust Silk Slip Dress',
    price: 220,
    category: 'women',
    collection: 'Wanderlust',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Flowing gracefully with every movement, this slip dress is cut on the bias from luxurious mulberry silk. It features adjustable spaghetti straps, a gentle cowl neckline, and a subtle side slit for an effortless evening or resort-wear drape.',
    details: [
      '100% Mulberry Silk (19 momme weight)',
      'Adjustable criss-cross back straps',
      'Slight cowl neck and elegant side-slit detailing',
      'Hand wash with silk-safe detergent, iron on lowest silk setting'
    ],
    sizes: ['XXS', 'S', 'M', 'L'],
    colors: [
      { name: 'Champagne Rose', hex: '#E4CFBC' },
      { name: 'Midnight Onyx', hex: '#111215' },
      { name: 'Terracotta Clay', hex: '#B85D43' }
    ],
    rating: 4.8,
    reviewsCount: 88,
    isNewArrival: true
  },
  {
    id: 'w-3',
    name: 'Sojourn Tailored Linen Blazer',
    price: 195,
    category: 'women',
    collection: 'Minimalist',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted from premium Belgian flax linen, the Sojourn Blazer features an unstructured, breathable tailoring style. Perfectly designed to keep you cool in warm weather while maintaining a sharp, relaxed professional contour.',
    details: [
      '100% Belgian flax linen outer, viscose lining',
      'Double-breasted horn-button closure',
      'Functional front welt pockets and rear vent',
      'Steam iron to release natural flax creases'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Flax White', hex: '#F5F2EB' },
      { name: 'Warm Olive', hex: '#5A6251' },
      { name: 'Navy Blue', hex: '#1D2A44' }
    ],
    rating: 4.7,
    reviewsCount: 65
  },
  {
    id: 'w-4',
    name: 'Isla Wide-Leg Trousers',
    price: 145,
    category: 'women',
    collection: 'Minimalist',
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb48862c6841?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Beautifully pleated high-waisted trousers with a sweeping wide-leg drape. Ideal for fluid coordination with linen blouses or lightweight knit tees. Features a concealed clasp and side pockets.',
    details: [
      '80% Tencel Lyocell, 20% Linen blend',
      'High-waisted fit with sophisticated front pleating',
      'Side slip pockets and back faux pocket welts',
      'Machine wash cold on delicate cycle'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sands of Gobi', hex: '#D2C3B1' },
      { name: 'Charcoal Mist', hex: '#3E4142' }
    ],
    rating: 4.6,
    reviewsCount: 94
  },

  // --- MEN'S COLLECTION ---
  {
    id: 'm-1',
    name: 'Wayfarer Wool-Alpaca Cardigan',
    price: 210,
    category: 'men',
    collection: 'Cozy Knitwear',
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An heritage-style ribbed cardigan blended with premium wool and alpaca fibers. This heavy-knit layer features genuine wood buttons, patch pockets, and a cozy shawl collar perfect for chilly coastal evenings or mountain escapes.',
    details: [
      '50% Extra-fine Merino Wool, 30% Alpaca, 20% Organic Cotton',
      'Genuine dark olive wood button fasteners',
      'Chunky shawl collar with thick ribbed cuffs and hem',
      'Hand wash inside-out, dry flat'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Driftwood Brown', hex: '#6E6259' },
      { name: 'Sage Green', hex: '#637060' },
      { name: 'Cream Chalk', hex: '#EDE8DF' }
    ],
    rating: 4.9,
    reviewsCount: 110,
    isBestSeller: true
  },
  {
    id: 'm-2',
    name: 'Nomad Premium Wool Overcoat',
    price: 340,
    category: 'men',
    collection: 'Wanderlust',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The ultimate outerwear piece, tailored meticulously with dense, soft Italian wool blend. The Nomad is unstructured around the shoulders to allow easy layering over heavy cardigans or casual hoodies, offering a streamlined, modern silhouette.',
    details: [
      '75% Recycled Italian Wool, 25% Polyamide for durability',
      'Unstructured modern fit with single back vent',
      'Two internal zip pockets and two external hand-warmer pockets',
      'Dry clean only'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Camel Tan', hex: '#C29C74' },
      { name: 'Obsidian Black', hex: '#1C1C1E' }
    ],
    rating: 5.0,
    reviewsCount: 52,
    isNewArrival: true
  },
  {
    id: 'm-3',
    name: 'Atlas Relaxed Linen Shirt',
    price: 95,
    category: 'men',
    collection: 'Wanderlust',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted from airy, breathable French linen, pre-washed for exceptional softness from day one. Designed with a clean band collar and button cuffs, this shirt offers an effortlessly styled look for any casual getaway.',
    details: [
      '100% French Flax Linen',
      'Elegant band collar and classic curved hemline',
      'Pre-shrunk and garment-dyed for a washed look',
      'Machine wash cold, tumble dry low or hang dry'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Oyster White', hex: '#F0ECE1' },
      { name: 'Sky Indigo', hex: '#5E748B' },
      { name: 'Terracotta', hex: '#C07E63' }
    ],
    rating: 4.8,
    reviewsCount: 204
  },
  {
    id: 'm-4',
    name: 'Hinterland Bomber Jacket',
    price: 175,
    category: 'men',
    collection: 'Minimalist',
    images: [
      'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A contemporary take on the classic utility jacket, crafted in heavy-duty organic cotton canvas with a water-resistant finish. Sleek minimalist rib cuffs and brass hardware deliver rugged endurance and daily urban polish.',
    details: [
      '100% Organic Cotton Canvas (12 oz weight)',
      'Water-repellent finish, lightweight windproof lining',
      'Heavy-duty brass YKK zipper with storm flap',
      'Wipe clean or gentle cold machine wash'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Earthy Clay', hex: '#8C624E' },
      { name: 'Midnight Forest', hex: '#2C3E33' }
    ],
    rating: 4.7,
    reviewsCount: 79
  },

  // --- CHILDREN'S COLLECTION ---
  {
    id: 'c-1',
    name: 'Little Wanderer Linen Overalls',
    price: 68,
    category: 'children',
    collection: 'Wanderlust',
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'These adorable child-friendly overalls are made from ultra-soft, breathable organic linen and cotton blend. Designed with adjustable shoulder button loops and bottom snaps for easy diaper access or quick changes.',
    details: [
      '55% Organic Linen, 45% Organic Cotton',
      'Adjustable dual-length button straps',
      'Concealed brass bottom snaps for toddler sizes',
      'Machine wash warm with like colors'
    ],
    sizes: ['6-12M', '12-18M', '2T', '3T', '4T', '5T'],
    colors: [
      { name: 'Soft Mustard', hex: '#DFA853' },
      { name: 'Dune Sand', hex: '#DACFB3' },
      { name: 'Sage Leaf', hex: '#8F9B8B' }
    ],
    rating: 4.9,
    reviewsCount: 56,
    isBestSeller: true
  },
  {
    id: 'c-2',
    name: 'Mini Organic Cotton Knit Romper',
    price: 52,
    category: 'children',
    collection: 'Cozy Knitwear',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Keep your little ones comfy in this finely knit premium cotton romper. Featuring flat flatlock seams that prevent skin irritation and a beautiful heirloom pattern stitched on the front.',
    details: [
      '100% Certified Organic Cotton yarn',
      'Satin-smooth interior flatlock stitching',
      'Warm yet airy honeycomb knit texture',
      'Machine wash cold, tumble dry low'
    ],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '2T'],
    colors: [
      { name: 'Cream Marshmallow', hex: '#F3EFE9' },
      { name: 'Dusty Peach', hex: '#E7B59F' }
    ],
    rating: 4.8,
    reviewsCount: 41,
    isNewArrival: true
  },
  {
    id: 'c-3',
    name: 'Meadow Cotton Knit Cardigan',
    price: 74,
    category: 'children',
    collection: 'Cozy Knitwear',
    images: [
      'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A beautiful, cozy button-up cardigan with patch pockets and ribbed cuffs, perfect for layering during breezy afternoons in the garden. Features unique wooden animal buttons.',
    details: [
      '100% GOTS Organic Cotton',
      'Genuine laser-etched maple wood buttons',
      'Two small functional hand-warmer front pockets',
      'Delicate laundry cycle recommended'
    ],
    sizes: ['12-18M', '2T', '3T', '4T', '5-6Y'],
    colors: [
      { name: 'Sage Green', hex: '#637060' },
      { name: 'Mustard Honey', hex: '#E29E4D' }
    ],
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'c-4',
    name: 'Sunrise Striped Tee & Shorts Set',
    price: 58,
    category: 'children',
    collection: 'Minimalist',
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An effortless two-piece matching coordinates set crafted from organic slub cotton. Designed with a soft-stretch waistband and a relaxed fit, allowing endless active play and exploration.',
    details: [
      '100% Cotton Slub Knit',
      'Tagless back neck labels for premium comfort',
      'Elastic adjustable drawcord waistband on shorts',
      'Pre-washed to resist shrinking'
    ],
    sizes: ['18-24M', '2T', '3T', '4T', '5-6Y', '7-8Y'],
    colors: [
      { name: 'Ocean Wave Stripe', hex: '#778D96' },
      { name: 'Terracotta Stripe', hex: '#C28470' }
    ],
    rating: 4.7,
    reviewsCount: 22
  }
];
