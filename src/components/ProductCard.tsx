import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Eye, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails, onQuickAdd }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Safely get alternate image if available on hover
  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col h-full bg-white border border-stone-200/60 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Visual badges (New / Best Seller) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNewArrival && (
          <span className="px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-xs">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider bg-amber-700 text-white rounded-xs">
            Best Seller
          </span>
        )}
      </div>

      {/* Image display container */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Action button overlay on hover */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 gap-2">
          <button
            id={`quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="flex-1 bg-white hover:bg-stone-100 text-stone-900 text-xs font-sans uppercase font-semibold tracking-wider py-2.5 px-3 rounded-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Eye size={14} />
            Quick View
          </button>
          
          <button
            id={`quick-add-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xs shadow-sm transition-colors cursor-pointer"
            title="Quick add to bag"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Product metadata content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5 text-stone-400 text-[10px] tracking-widest uppercase font-sans">
          <span>{product.collection}</span>
          <span>{product.category}</span>
        </div>

        <h3
          id={`product-title-${product.id}`}
          onClick={() => onViewDetails(product)}
          className="font-serif text-sm sm:text-base font-bold text-stone-900 line-clamp-1 mb-1.5 group-hover:text-stone-600 transition-colors cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Rating and review counts */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-500">
            <Star size={12} fill="currentColor" />
          </div>
          <span className="text-[11px] font-sans font-medium text-stone-700">{product.rating.toFixed(1)}</span>
          <span className="text-[11px] font-sans text-stone-400">({product.reviewsCount})</span>
        </div>

        {/* Price tag */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-stone-100">
          <span className="font-sans font-bold text-stone-900 text-base">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[10px] font-sans text-stone-500 uppercase tracking-wider">
            Premium Tailor
          </span>
        </div>
      </div>
    </motion.div>
  );
}
