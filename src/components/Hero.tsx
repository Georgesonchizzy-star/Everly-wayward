import { motion } from 'motion/react';
import { ArrowDown, MoveRight, Shield, Award, RefreshCw } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroProps {
  onShopClick: (category: 'all' | 'men' | 'women' | 'children') => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  return (
    <section className="relative min-h-screen bg-stone-900 flex items-center justify-center overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Everly Wayward Campaign"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-70 scale-105 animate-[pulse_8s_infinite_alternate]"
        />
        {/* Soft elegant gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-stone-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-stone-950/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.5em] text-amber-300 font-semibold mb-4 inline-block">
            High-End Autumn/Winter Campaign
          </span>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight mb-6 leading-tight">
            For the <br className="hidden sm:inline" />
            <span className="italic font-normal font-serif text-stone-200">Wayward Ones</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-stone-300 font-sans font-light tracking-wide max-w-xl mx-auto mb-10 leading-relaxed">
            Thoughtfully tailored in rare cashmere, raw Belgian linen, and certified organic cotton. Everly Wayward crafts timeless apparel that honors your journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              id="hero-shop-women-btn"
              onClick={() => onShopClick('women')}
              className="w-full sm:w-auto px-8 py-3.5 bg-stone-50 hover:bg-stone-200 text-stone-900 font-sans font-medium text-sm tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer group"
            >
              Shop Women
              <MoveRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              id="hero-shop-men-btn"
              onClick={() => onShopClick('men')}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/80 font-sans font-medium text-sm tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 cursor-pointer group"
            >
              Discover Men
              <MoveRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Feature Highlights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mt-16 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/15"
        >
          <div className="flex items-center justify-center gap-3 text-left">
            <Shield className="text-amber-300 shrink-0" size={24} />
            <div>
              <p className="font-sans font-medium text-sm text-stone-100 uppercase tracking-wider">Premium Security</p>
              <p className="font-sans text-xs text-stone-400">Streamlined checkout & fraud-free payments</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-left">
            <Award className="text-amber-300 shrink-0" size={24} />
            <div>
              <p className="font-sans font-medium text-sm text-stone-100 uppercase tracking-wider">Ethical Sourcing</p>
              <p className="font-sans text-xs text-stone-400">100% natural fibers & fair-trade ateliers</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-left">
            <RefreshCw className="text-amber-300 shrink-0" size={24} />
            <div>
              <p className="font-sans font-medium text-sm text-stone-100 uppercase tracking-wider">Flawless Fit</p>
              <p className="font-sans text-xs text-stone-400">Complimentary global exchanges & returns</p>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 flex flex-col items-center text-stone-400 animate-bounce">
          <span className="text-[10px] tracking-[0.3em] uppercase mb-2 font-sans font-light">Scroll Down</span>
          <ArrowDown size={14} />
        </div>
      </div>
    </section>
  );
}
