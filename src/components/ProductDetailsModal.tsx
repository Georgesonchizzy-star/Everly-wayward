import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Heart, Check, HelpCircle, Package, Truck, ShoppingBag } from 'lucide-react';
import { Product, Color } from '../types';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: Color, qty: number) => void;
}

export default function ProductDetailsModal({ product, onClose, onAddToCart }: ProductDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'shipping'>('overview');
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm"
        />

        {/* Modal container */}
        <motion.div
          id="modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-stone-50 w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden z-10 max-h-[90vh] md:max-h-none flex flex-col md:grid md:grid-cols-2"
        >
          {/* Close button */}
          <button
            id="close-details-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-stone-900 rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* LEFT COLUMN: Gallery */}
          <div className="p-4 sm:p-6 md:p-8 bg-stone-100 flex flex-col gap-4 overflow-y-auto max-h-[40vh] md:max-h-none justify-center">
            {/* Primary active image preview */}
            <div className="relative aspect-[3/4] bg-white rounded-sm overflow-hidden border border-stone-200 shadow-sm">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnail selector gallery strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    id={`thumb-btn-${idx}`}
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 aspect-[3/4] rounded-xs overflow-hidden border-2 bg-white shrink-0 cursor-pointer ${
                      selectedImage === img ? 'border-stone-900' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive selections */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[85vh] bg-stone-50">
            {/* Collection tag and brand name */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans text-amber-800 font-semibold uppercase tracking-widest">
                {product.collection} COLLECTION
              </span>
              <span className="text-[10px] text-stone-400 font-sans tracking-widest uppercase">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3 leading-tight">
              {product.name}
            </h2>

            {/* Rating and Price row */}
            <div className="flex items-center justify-between py-4 border-y border-stone-200/80 mb-6">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      className={i < Math.floor(product.rating) ? 'text-amber-500' : 'text-stone-300'}
                    />
                  ))}
                </div>
                <span className="text-xs font-sans font-bold text-stone-700 ml-1">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs font-sans text-stone-400">
                  ({product.reviewsCount} reviews)
                </span>
              </div>
              <span className="font-sans font-extrabold text-2xl text-stone-950">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Colors Selection */}
            <div className="mb-5">
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                Color: <span className="font-light text-stone-500">{selectedColor.name}</span>
              </h4>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    id={`color-swatch-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.hex }}
                    className={`relative w-8 h-8 rounded-full border border-stone-300 shadow-inner flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 ${
                      selectedColor.name === color.name
                        ? 'ring-2 ring-stone-900 ring-offset-2 scale-105'
                        : ''
                    }`}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <Check
                        size={14}
                        className={
                          color.hex === '#F5F2EB' || color.hex === '#F3EFE9' || color.hex === '#E5DCD3' || color.hex === '#EDE8DF'
                            ? 'text-stone-900'
                            : 'text-white'
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2.5">
                <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-700">
                  Select Size: <span className="font-light text-stone-500">{selectedSize}</span>
                </h4>
                <button
                  id="size-guide-btn"
                  className="text-stone-500 hover:text-stone-900 text-xs font-sans flex items-center gap-1 transition-colors cursor-pointer"
                  onClick={() => alert(`Size selection is tailored standard. Sizing fits true to form. If you are between sizes, Everly Wayward recommends ordering a size up.`)}
                >
                  <HelpCircle size={14} />
                  Sizing Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    id={`size-pill-${size}`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 h-10 px-3.5 border rounded-xs font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      selectedSize === size
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-300 bg-white text-stone-800 hover:border-stone-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8 flex items-center gap-4">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-stone-700">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-sm overflow-hidden bg-white">
                <button
                  id="qty-decrement"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-stone-500 hover:text-stone-900 transition-colors hover:bg-stone-50 font-sans cursor-pointer font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-sans font-semibold text-stone-900">{quantity}</span>
                <button
                  id="qty-increment"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-stone-500 hover:text-stone-900 transition-colors hover:bg-stone-50 font-sans cursor-pointer font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
              <button
                id="add-to-bag-btn"
                onClick={handleAdd}
                disabled={isAdded}
                className={`flex-1 font-sans font-medium text-sm tracking-widest uppercase py-4 rounded-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md border cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-stone-900 hover:bg-stone-800 border-stone-900 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Bag
                  </>
                )}
              </button>

              <button
                id="wishlist-toggle-btn"
                onClick={() => alert(`Saved! You've added "${product.name}" to your private Wishlist.`)}
                className="p-4 border border-stone-300 text-stone-600 hover:text-amber-800 hover:border-amber-800 rounded-sm transition-colors cursor-pointer bg-white"
                title="Add to wishlist"
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Information Tabs */}
            <div className="mt-auto border-t border-stone-200 pt-6">
              <div className="flex border-b border-stone-200 mb-4">
                {(['overview', 'details', 'shipping'] as const).map((tab) => (
                  <button
                    id={`info-tab-${tab}`}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-xs font-sans font-bold uppercase tracking-wider text-center transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'border-b-2 border-stone-900 text-stone-900'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-xs leading-relaxed text-stone-600 min-h-24 font-sans font-light">
                {activeTab === 'overview' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'details' && (
                  <ul className="space-y-1.5 list-disc pl-4 text-stone-600 font-light">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-3 font-light text-stone-600">
                    <div className="flex gap-2.5 items-start">
                      <Truck size={16} className="text-stone-800 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-800">Complimentary Global Shipping</p>
                        <p>Standard priority deliveries within 3-6 business days. Expedited overnight available.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <Package size={16} className="text-stone-800 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-800">Sustainable Packing</p>
                        <p>All items arrive in biodegradable boxes made of post-consumer recycled pulp.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
