import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, SlidersHorizontal, ArrowUpDown, ChevronDown, CheckCircle } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import OrderConfirmation from './components/OrderConfirmation';
import Footer from './components/Footer';

import { PRODUCTS } from './data/products';
import { CartItem, Product, Color, ShippingDetails, PaymentDetails } from './types';

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'confirmation'>('home');
  const [activeCategory, setActiveCategory] = useState<'all' | 'men' | 'women' | 'children'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shopping Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Interactive Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Coupon/Discount States (Passed from Cart Drawer)
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');

  // Finished Invoice details
  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    shipping: ShippingDetails;
    payment: PaymentDetails;
    items: CartItem[];
    totals: { subtotal: number; discount: number; shippingCost: number; tax: number; total: number };
  } | null>(null);

  // Filter & Sort state variables
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low-high' | 'price-high-low' | 'rating'>('featured');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('everly_wayward_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    }
  }, []);

  // Sync cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('everly_wayward_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  };

  // Unique collections list for dropdown filter
  const collections = useMemo(() => {
    const list = new Set(PRODUCTS.map((p) => p.collection));
    return ['All', ...Array.from(list)];
  }, []);

  // Filter & sort product calculations
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Category check
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      // 2. Collection check
      if (selectedCollection !== 'All' && product.collection !== selectedCollection) {
        return false;
      }
      // 3. Search query check (fuzzy search over title, category, collection, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.name.toLowerCase().includes(query);
        const matchesCol = product.collection.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        return matchesTitle || matchesCol || matchesDesc || matchesCat;
      }
      return true;
    }).sort((a, b) => {
      // 4. Sort check
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured' retains original catalog sequence
    });
  }, [activeCategory, selectedCollection, searchQuery, sortBy]);

  // Add to Shopping Bag Action
  const handleAddToCart = (product: Product, size: string, color: Color, qty: number) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor.name === color.name
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += qty;
    } else {
      newCart.push({
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: qty,
      });
    }

    saveCart(newCart);
  };

  // Quick Add from Home Grid (defaults to standard size M, first color available)
  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0];
    handleAddToCart(product, defaultSize, defaultColor, 1);
    setIsCartOpen(true); // Guide user instantly to visual feedback drawer
  };

  // Update line item quantity inside drawer
  const handleUpdateQty = (index: number, change: number) => {
    let newCart = [...cart];
    const target = newCart[index];
    if (!target) return;

    const updatedQty = target.quantity + change;
    if (updatedQty <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].quantity = updatedQty;
    }
    saveCart(newCart);
  };

  // Delete line item from drawer
  const handleRemoveItem = (index: number) => {
    let newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
  };

  // Cart drawer triggers checkout process
  const handleCheckoutTrigger = (discount: number, code: string) => {
    setPromoDiscount(discount);
    setPromoCode(code);
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirm and save order
  const handleOrderCompleted = (
    shipping: ShippingDetails,
    payment: PaymentDetails,
    totals: { subtotal: number; discount: number; shippingCost: number; tax: number; total: number }
  ) => {
    const orderId = `EW-${Math.floor(100000 + Math.random() * 900000)}-2026`;
    setCompletedOrder({
      id: orderId,
      shipping,
      payment,
      items: [...cart],
      totals,
    });
    
    // Clear shopping bag securely
    saveCart([]);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueShopping = () => {
    setCompletedOrder(null);
    setCurrentView('home');
    setActiveCategory('all');
    setSelectedCollection('All');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-stone-50 min-h-screen font-sans antialiased text-stone-900 selection:bg-stone-900 selection:text-white">
      
      {/* Universal Sticky Header */}
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onViewStory={() => {
          const footer = document.querySelector('footer');
          footer?.scrollIntoView({ behavior: 'smooth' });
        }}
        onGoHome={() => setCurrentView('home')}
      />

      {/* RENDER VIEW: Confirmation */}
      {currentView === 'confirmation' && completedOrder && (
        <OrderConfirmation
          orderId={completedOrder.id}
          shipping={completedOrder.shipping}
          payment={completedOrder.payment}
          cartItems={completedOrder.items}
          totals={completedOrder.totals}
          onContinueShopping={handleContinueShopping}
        />
      )}

      {/* RENDER VIEW: Checkout */}
      {currentView === 'checkout' && (
        <CheckoutForm
          cartItems={cart}
          promoDiscount={promoDiscount}
          promoCode={promoCode}
          onCancel={() => setCurrentView('home')}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* RENDER VIEW: Home & Store Catalog */}
      {currentView === 'home' && (
        <main className="pb-16">
          {/* Full-width editorial Hero Banner */}
          <Hero onShopClick={(cat) => {
            setActiveCategory(cat);
            const catalogSec = document.getElementById('boutique-catalog');
            catalogSec?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }} />

          {/* Section: Brand Legacy Philosophy */}
          <section className="py-20 bg-stone-100 border-b border-stone-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <span className="text-xs font-sans font-bold uppercase tracking-[0.4em] text-amber-800">
                Ethical Sourcing & Traceable Craft
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 leading-tight">
                Honoring the materials that frame our journeys
              </h2>
              <p className="font-sans text-sm sm:text-base font-light text-stone-600 max-w-3xl mx-auto leading-relaxed">
                Everly Wayward was founded on the belief that clothing should be a companion to exploration, not a compromise on quality. Every item in our Men's, Women's, and Children's collections is spun in small-batch family cooperatives. We provide transparent sourcing for our Grade-A cashmere from Alashan, flax fibers from Belgian farms, and certified GOTS organic cotton. Beautiful, tailored garments designed to endure.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
                <div className="p-4 bg-white/60 border border-stone-200 rounded-xs">
                  <p className="font-serif font-bold text-xl text-stone-900">100%</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-stone-500 mt-1">Natural Fibers</p>
                </div>
                <div className="p-4 bg-white/60 border border-stone-200 rounded-xs">
                  <p className="font-serif font-bold text-xl text-stone-900">Fair Trade</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-stone-500 mt-1">Certified Ateliers</p>
                </div>
                <div className="p-4 bg-white/60 border border-stone-200 rounded-xs">
                  <p className="font-serif font-bold text-xl text-stone-900">Pre-washed</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-stone-500 mt-1">Exceptional Softness</p>
                </div>
                <div className="p-4 bg-white/60 border border-stone-200 rounded-xs">
                  <p className="font-serif font-bold text-xl text-stone-900">Carbon Free</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-stone-500 mt-1">Global Shipping</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Interactive Boutique Store */}
          <section id="boutique-catalog" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Boutique Section Header & Categories */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="text-left">
                  <span className="text-xs font-sans text-amber-800 uppercase tracking-widest font-bold">
                    Everly Catalog
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
                    {activeCategory === 'all' && 'The Full Ready-To-Wear Collection'}
                    {activeCategory === 'men' && "Men's Premium Collection"}
                    {activeCategory === 'women' && "Women's Premium Collection"}
                    {activeCategory === 'children' && "Children's Playful Collection"}
                  </h2>
                  <p className="text-xs font-sans text-stone-400 mt-1 font-light">
                    Sustainably crafted in small batches. Showing {filteredProducts.length} premium styles.
                  </p>
                </div>

                {/* Categories tab pills (Alternative view on catalog page) */}
                <div className="flex flex-wrap gap-2">
                  {(['all', 'women', 'men', 'children'] as const).map((cat) => (
                    <button
                      id={`catalog-tab-${cat}`}
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setSelectedCollection('All');
                      }}
                      className={`px-4 py-2 text-xs font-sans uppercase font-bold tracking-wider rounded-full border transition-all cursor-pointer ${
                        activeCategory === cat
                          ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters Toggle & Sort Bar */}
              <div className="border border-stone-200 bg-white rounded-sm p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                {/* Expand trigger */}
                <button
                  id="filter-toggle-btn"
                  onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                  className="px-4 py-2 rounded-xs border border-stone-300 hover:border-stone-800 text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors text-stone-700 bg-stone-50"
                >
                  <SlidersHorizontal size={14} />
                  Filter by Collection
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isFiltersExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Sorter selection */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <ArrowUpDown size={14} className="text-stone-400" />
                  <span className="text-xs font-sans text-stone-500">Sort by:</span>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="text-xs font-sans font-bold uppercase tracking-wider px-3 py-1.5 border border-stone-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-stone-500 text-stone-800 cursor-pointer"
                  >
                    <option value="featured">Featured Styles</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Expandable filters shelf */}
              <AnimatePresence>
                {isFiltersExpanded && (
                  <motion.div
                    id="filters-shelf"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-8"
                  >
                    <div className="bg-stone-100 p-5 rounded-xs border border-stone-200/80 text-left space-y-3">
                      <p className="text-xs font-sans font-bold uppercase tracking-wider text-stone-700">Filter Collections:</p>
                      <div className="flex flex-wrap gap-2">
                        {collections.map((colName) => (
                          <button
                            id={`collection-pill-${colName.toLowerCase().replace(/\s+/g, '-')}`}
                            key={colName}
                            onClick={() => setSelectedCollection(colName)}
                            className={`px-3 py-1.5 text-xs font-sans rounded-xs border cursor-pointer transition-colors ${
                              selectedCollection === colName
                                ? 'bg-amber-800 text-white border-amber-800 font-semibold'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {colName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products Grid display */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-sm border border-stone-200/60 shadow-xs">
                  <Compass className="mx-auto text-stone-300 mb-4 stroke-[1]" size={48} />
                  <p className="font-serif text-lg font-bold text-stone-700">No matching apparel found</p>
                  <p className="text-xs font-sans text-stone-400 mt-1 max-w-sm mx-auto">
                    We could not find anything matching "{searchQuery}" under {selectedCollection} collection. Try expanding your search queries.
                  </p>
                  <button
                    id="reset-search-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCollection('All');
                      setActiveCategory('all');
                    }}
                    className="mt-6 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-sans uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(p) => setSelectedProduct(p)}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <Footer />

      {/* SLIDING SHOPPING CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutTrigger}
      />

      {/* QUICK VIEW DETAILS MODAL OVERLAY */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

