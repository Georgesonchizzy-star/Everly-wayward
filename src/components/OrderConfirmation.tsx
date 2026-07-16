import { motion } from 'motion/react';
import { CheckCircle, Calendar, Mail, MapPin, Gift, ArrowRight } from 'lucide-react';
import { ShippingDetails, PaymentDetails, CartItem } from '../types';

interface OrderConfirmationProps {
  orderId: string;
  shipping: ShippingDetails;
  payment: PaymentDetails;
  cartItems: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    shippingCost: number;
    tax: number;
    total: number;
  };
  onContinueShopping: () => void;
}

export default function OrderConfirmation({
  orderId,
  shipping,
  payment,
  cartItems,
  totals,
  onContinueShopping,
}: OrderConfirmationProps) {
  // Calculate delivery date estimates based on standard vs expedited
  const getDeliveryEstimateRange = () => {
    const today = new Date();
    const daysToAddMin = totals.shippingCost > 0 ? 1 : 3;
    const daysToAddMax = totals.shippingCost > 0 ? 2 : 5;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + daysToAddMin);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + daysToAddMax);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', weekday: 'short' };
    return `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-16 pt-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Confetti-style visual checkmark */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mb-5"
          >
            <CheckCircle size={36} />
          </motion.div>
          
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
            Payment Completed
          </h2>
          <p className="text-xs font-sans text-stone-500 uppercase tracking-widest font-semibold mb-1">
            Order Reference: {orderId}
          </p>
          <p className="text-sm font-sans text-stone-600 max-w-md mx-auto">
            Your transaction was authorized successfully. We have dispatched a pristine digital invoice receipt to <span className="font-semibold text-stone-900">{shipping.email}</span>.
          </p>
        </div>

        {/* Informative Grid */}
        <div className="bg-white rounded-sm border border-stone-200 shadow-sm overflow-hidden mb-8">
          
          {/* Estimated dispatch calendar strip */}
          <div className="p-5 bg-stone-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar size={22} className="text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400">Estimated Delivery Arrival</p>
                <p className="font-sans font-bold text-sm text-stone-100">{getDeliveryEstimateRange()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-sm border border-white/10">
              <Gift size={15} className="text-amber-300" />
              <span className="font-sans text-[10px] uppercase tracking-wider font-medium text-stone-200">Eco-Friendly Wrapping</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Delivery address & payment summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-stone-100 text-xs text-stone-600 font-sans">
              <div className="space-y-2 text-left">
                <p className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} /> Shipping Destination
                </p>
                <p className="font-medium text-stone-800">
                  {shipping.firstName} {shipping.lastName}
                </p>
                <p>{shipping.address} {shipping.apartment && `, ${shipping.apartment}`}</p>
                <p>{shipping.city}, {shipping.state} {shipping.zipCode}</p>
                <p className="text-stone-400">Phone: {shipping.phone}</p>
              </div>

              <div className="space-y-2 text-left">
                <p className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={13} /> Payment Authorization
                </p>
                <p className="font-medium text-stone-800">
                  Method: <span className="uppercase text-amber-900 font-bold">{shipping.apartment === 'Express Checkout' ? 'Express Wallet' : payment.method}</span>
                </p>
                {payment.method === 'card' ? (
                  <p className="font-mono">
                    Card Ending: **** {payment.cardNumber?.slice(-4) || '7841'}
                  </p>
                ) : (
                  <p>Express verified check approved</p>
                )}
                <p className="text-emerald-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                  ✓ SSL Authorized Clear
                </p>
              </div>
            </div>

            {/* Selected item lines */}
            <div className="space-y-4">
              <p className="font-sans font-bold text-stone-900 text-xs uppercase tracking-wider text-left">Purchased Apparel</p>
              <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center text-xs">
                    <div className="w-10 aspect-[3/4] bg-stone-100 rounded-xs overflow-hidden border shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-sans font-bold text-stone-800 truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-stone-400 font-sans uppercase tracking-wider mt-0.5">
                        Size: {item.selectedSize} · Color: {item.selectedColor.name} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-sans font-bold text-stone-900 shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtotal listings */}
            <div className="pt-6 border-t border-stone-100 space-y-2.5 font-sans text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">${totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Discount</span>
                  <span>-${totals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-stone-900">
                  {totals.shippingCost === 0 ? 'Complimentary Standard' : `$${totals.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Calculated Sales Tax</span>
                <span className="font-medium text-stone-900">${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-3 border-t border-stone-100">
                <span>Invoice Total Charged</span>
                <span className="text-amber-950">${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom notes and CTA */}
        <div className="space-y-6 text-center">
          <div className="p-4 bg-amber-50/60 border border-amber-200/50 rounded-sm text-xs font-sans text-stone-600 leading-relaxed max-w-xl mx-auto">
            💡 <span className="font-bold text-stone-800">Legacy Fit Promise</span>: Need a different size? We offer a 30-day complimentary prepaid return box. Simply re-use our box and apply the prepaid label inside.
          </div>

          <button
            id="confirmation-continue-btn"
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-sans font-medium text-xs tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md cursor-pointer group"
          >
            Continue Wandering
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
