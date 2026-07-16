import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldAlert } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (idx: number, change: number) => void;
  onRemoveItem: (idx: number) => void;
  onCheckout: (promoDiscount: number, promoCode: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const applyPromoCode = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'WAYWARD') {
      setAppliedPromo('WAYWARD');
      setDiscountPercent(15);
      setPromoCodeInput('');
    } else if (code === 'WANDER') {
      setAppliedPromo('WANDER');
      setDiscountPercent(20);
      setPromoCodeInput('');
    } else if (code) {
      setPromoError('Invalid coupon code. Try "WAYWARD" or "WANDER".');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setDiscountPercent(0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = subtotal - discountAmount;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Back shadow overlay */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950 z-45"
          />

          {/* Sliding panel */}
          <motion.div
            id="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-stone-50 shadow-2xl z-50 flex flex-col h-full border-l border-stone-200"
          >
            {/* Cart Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-stone-800" />
                <h3 className="font-serif text-lg font-bold text-stone-900">Your Shopping Bag</h3>
                <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold font-sans">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart list body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-2/3 text-center p-6 text-stone-400">
                  <ShoppingBag size={52} className="stroke-[1] mb-4 text-stone-300" />
                  <p className="font-serif text-base text-stone-700 font-bold mb-1">Your bag is empty</p>
                  <p className="text-xs font-sans text-stone-400 max-w-[240px] leading-relaxed">
                    Explore our exquisite ready-to-wear collections and find your wandering fit.
                  </p>
                  <button
                    id="cart-continue-shop-btn"
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-sans text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <motion.div
                    id={`cart-item-${item.product.id}-${idx}`}
                    layout
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${idx}`}
                    className="flex gap-4 p-3 bg-white border border-stone-200/80 rounded-sm shadow-xs relative group"
                  >
                    {/* Item thumbnail */}
                    <div className="w-20 aspect-[3/4] rounded-xs bg-stone-100 overflow-hidden border border-stone-100 shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Item parameters */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-sans font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="font-sans font-bold text-xs text-stone-950 shrink-0">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-stone-400 font-sans uppercase tracking-wider mt-0.5">
                          Collection: {item.product.collection}
                        </p>

                        {/* Specs badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-1.5 py-0.5 text-[9px] font-sans font-semibold border border-stone-300 bg-stone-50 text-stone-700 rounded-xs uppercase">
                            Size: {item.selectedSize}
                          </span>
                          <span className="px-1.5 py-0.5 text-[9px] font-sans font-semibold border border-stone-300 bg-stone-50 text-stone-700 rounded-xs flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full border border-stone-400 inline-block"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        </div>
                      </div>

                      {/* Quantity manipulation and delete */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone-300 rounded-xs overflow-hidden bg-white text-xs scale-90 -ml-1">
                          <button
                            id={`qty-dec-${idx}`}
                            onClick={() => onUpdateQty(idx, -1)}
                            className="px-2.5 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-50 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 font-sans font-semibold text-stone-800">{item.quantity}</span>
                          <button
                            id={`qty-inc-${idx}`}
                            onClick={() => onUpdateQty(idx, 1)}
                            className="px-2.5 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-50 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          id={`cart-remove-${idx}`}
                          onClick={() => onRemoveItem(idx)}
                          className="text-stone-400 hover:text-rose-700 p-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Cart Footer / Totals Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-stone-200 bg-white p-5 space-y-4">
                {/* Promo Code section */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        id="promo-code-input"
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="w-full text-xs font-sans pl-8 pr-3 py-2 border border-stone-300 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-500 rounded-sm uppercase text-stone-800"
                      />
                      <Tag size={13} className="absolute left-2.5 top-2.5 text-stone-400" />
                    </div>
                    <button
                      id="apply-promo-btn"
                      onClick={applyPromoCode}
                      className="px-4 py-2 border border-stone-900 hover:bg-stone-900 hover:text-white text-stone-900 text-xs font-sans font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p id="promo-error-msg" className="text-[10px] text-rose-700 font-sans font-medium flex items-center gap-1">
                      <ShieldAlert size={12} />
                      {promoError}
                    </p>
                  )}
                  {appliedPromo && (
                    <div id="applied-promo-badge" className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xs p-1.5 text-xs text-emerald-800 font-sans">
                      <span className="flex items-center gap-1 font-semibold">
                        <Tag size={12} fill="currentColor" />
                        Code "{appliedPromo}" Applied ({discountPercent}% Off)
                      </span>
                      <button
                        id="remove-promo-btn"
                        onClick={removePromoCode}
                        className="text-stone-500 hover:text-stone-900 underline font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Subtotals list */}
                <div className="space-y-2.5 border-b border-stone-100 pb-3.5 text-stone-700 font-sans text-xs">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-500 text-[10px]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                {/* Grand total */}
                <div className="flex justify-between font-sans text-stone-900 font-bold text-base pt-1">
                  <span>Estimated Total</span>
                  <span className="text-lg">${grandTotal.toFixed(2)}</span>
                </div>

                {/* Secure checkout trigger */}
                <button
                  id="cart-checkout-btn"
                  onClick={() => onCheckout(discountPercent, appliedPromo || '')}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-sans font-medium text-xs tracking-widest uppercase py-4 rounded-sm shadow-md flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer group"
                >
                  Streamlined Checkout
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>

                <p className="text-[10px] text-center text-stone-400 font-sans">
                  🛡️ SSL Encrypted Payments. Secure Checkout Protocol.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
