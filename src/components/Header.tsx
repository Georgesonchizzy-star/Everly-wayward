import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, Compass, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  activeCategory: 'all' | 'men' | 'women' | 'children';
  setActiveCategory: (cat: 'all' | 'men' | 'women' | 'children') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onViewStory: () => void;
  onGoHome: () => void;
}

export default function Header({
  cartCount,
  onCartClick,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  onViewStory,
  onGoHome,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'All Collection', value: 'all' as const },
    { label: 'Women', value: 'women' as const },
    { label: 'Men', value: 'men' as const },
    { label: 'Children', value: 'children' as const },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-50/90 backdrop-blur-md shadow-sm border-b border-stone-200 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-stone-800 hover:text-stone-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Nav links - Desktop */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
              {navItems.map((item) => (
                <button
                  id={`nav-item-${item.value}`}
                  key={item.value}
                  onClick={() => {
                    setActiveCategory(item.value);
                    onGoHome(); // Reset views to catalog
                  }}
                  className={`relative py-1 text-stone-800 transition-colors hover:text-stone-500 font-sans cursor-pointer ${
                    activeCategory === item.value ? 'text-stone-900 font-semibold' : 'text-stone-600'
                  }`}
                >
                  {item.label}
                  {activeCategory === item.value && (
                    <motion.div
                      layoutId="activeCategoryUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
              <button
                id="nav-item-story"
                onClick={onViewStory}
                className="py-1 text-stone-600 hover:text-stone-900 transition-colors font-sans cursor-pointer"
              >
                Our Legacy
              </button>
            </nav>

            {/* Brand Logo */}
            <div className="flex-1 md:flex-none text-center">
              <button
                id="brand-logo"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  onGoHome();
                }}
                className="inline-block cursor-pointer"
              >
                <h1 className="text-2xl sm:text-3xl font-serif tracking-widest text-stone-900 font-bold">
                  EVERLY WAYWARD
                </h1>
                <p className="text-[9px] tracking-[0.3em] uppercase text-stone-500 -mt-1 font-sans">
                  The Wanderers Elegance
                </p>
              </button>
            </div>

            {/* Actions (Search, Wishlist, Bag) */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Expandable Search Bar */}
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchExpanded && (
                    <motion.input
                      id="search-input"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 180, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      type="text"
                      placeholder="Search apparel..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="hidden sm:block text-xs font-sans px-3 py-1.5 rounded-full border border-stone-300 bg-stone-100/80 focus:outline-none focus:ring-1 focus:ring-stone-500 mr-2 text-stone-800"
                    />
                  )}
                </AnimatePresence>
                <button
                  id="search-toggle-btn"
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  className="p-1.5 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* Minimalist Brand values indicator / Wishlist Icon */}
              <button
                id="legacy-badge-btn"
                onClick={onViewStory}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer"
              >
                <Compass size={14} className="animate-spin-slow" />
                <span className="font-sans font-medium">Est. 2026</span>
              </button>

              {/* Shopping Bag Button */}
              <button
                id="cart-trigger-btn"
                onClick={onCartClick}
                className="relative p-2 text-stone-800 hover:text-stone-600 transition-colors focus:outline-none cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={22} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      id="cart-badge-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold font-sans leading-none text-white bg-amber-800 rounded-full"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-stone-50 z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-lg tracking-wider font-bold text-stone-900">
                    EVERLY WAYWARD
                  </span>
                  <button
                    id="close-mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-stone-800 hover:text-stone-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6 relative">
                  <input
                    id="mobile-search-input"
                    type="text"
                    placeholder="Search Everly..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-sans pl-10 pr-4 py-2 rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-stone-400" />
                </div>

                <div className="flex flex-col space-y-4 text-base font-medium">
                  {navItems.map((item) => (
                    <button
                      id={`mobile-nav-${item.value}`}
                      key={item.value}
                      onClick={() => {
                        setActiveCategory(item.value);
                        setIsMobileMenuOpen(false);
                        onGoHome();
                      }}
                      className={`text-left py-2 border-b border-stone-200 transition-colors font-sans cursor-pointer ${
                        activeCategory === item.value
                          ? 'text-stone-900 font-bold pl-1'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    id="mobile-nav-story"
                    onClick={() => {
                      onViewStory();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left py-2 border-b border-stone-200 text-stone-600 hover:text-stone-900 font-sans cursor-pointer"
                  >
                    Our Legacy
                  </button>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="text-xs text-stone-500 font-sans tracking-wide mb-1">
                  PREMIUM READY TO WEAR
                </p>
                <p className="text-[10px] text-stone-400 font-sans">
                  Crafted for wandering souls who appreciate the quality of timeless tailoring.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
