import React, { useState } from 'react';
import { Mail, Compass, HelpCircle, Phone, Globe, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 font-sans pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-stone-800">
          
          {/* Brand & bio column */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <h3 className="font-serif text-xl tracking-widest text-stone-100 font-bold">EVERLY WAYWARD</h3>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm font-light">
              We craft garments that honor your journey. Born out of wanderlust and a pursuit of natural elegance, Everly Wayward designs unstructured tailoring using Mongolian cashmere, flax linen, and organic cotton.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-amber-300 font-medium tracking-wider uppercase">
              <Compass size={15} className="animate-spin-slow" />
              <span>Timeless Tailoring · Est. 2026</span>
            </div>
          </div>

          {/* Help Links column */}
          <div className="lg:col-span-2 space-y-4 text-left text-xs">
            <h4 className="font-sans font-bold uppercase tracking-wider text-stone-100">Customer Support</h4>
            <ul className="space-y-2.5 font-light text-stone-400">
              <li><button onClick={() => alert('All shipments arrive via priority standard express. Standard delivery is complimentary.')} className="hover:text-amber-300 transition-colors cursor-pointer">Shipping & Deliveries</button></li>
              <li><button onClick={() => alert('Complimentary prepaid return postage is enclosed in every purchase box for 30 days.')} className="hover:text-amber-300 transition-colors cursor-pointer">Legacy Fit Guarantee</button></li>
              <li><button onClick={() => alert('Our team is standing by 24/7 to adjust your sizes or addresses.')} className="hover:text-amber-300 transition-colors cursor-pointer">Exchanges & Cancellations</button></li>
              <li><button onClick={() => alert('Everly Wayward runs an authorized SSL 256-bit gateway. No credit card details are ever logged.')} className="hover:text-amber-300 transition-colors cursor-pointer">Transaction Security</button></li>
            </ul>
          </div>

          {/* Collection Shortcut column */}
          <div className="lg:col-span-2 space-y-4 text-left text-xs">
            <h4 className="font-sans font-bold uppercase tracking-wider text-stone-100">Ateliers & Story</h4>
            <ul className="space-y-2.5 font-light text-stone-400">
              <li><button onClick={() => alert('We source Grade-A cashmere from Inner Mongolia and linen from local Belgian cooperatives.')} className="hover:text-amber-300 transition-colors cursor-pointer">Traceable Fabrics</button></li>
              <li><button onClick={() => alert('Every piece is tailored by fair-trade family-owned ateliers in Portugal and Italy.')} className="hover:text-amber-300 transition-colors cursor-pointer">Ethical Tailoring</button></li>
              <li><button onClick={() => alert('We pack 100% of our apparel in recycled biodegradable paper pulps.')} className="hover:text-amber-300 transition-colors cursor-pointer">Sustainable Packaging</button></li>
              <li><button onClick={() => alert('Discover our brand legacy and vision founded in Austin, Texas.')} className="hover:text-amber-300 transition-colors cursor-pointer">Our Founders Legacy</button></li>
            </ul>
          </div>

          {/* Interactive Newsletter Subscription column */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h4 className="font-sans font-bold uppercase tracking-wider text-stone-100 text-xs">The Wayward Journal</h4>
            <p className="text-stone-400 text-xs leading-relaxed font-light">
              Receive early priority invites to seasonal pre-sales, traceable atelier field logs, and exclusive coupon codes.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Enter email for 15% off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-sans pl-8 pr-3 py-2.5 border border-stone-800 bg-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-300 rounded-xs text-stone-100 placeholder-stone-500"
                  />
                  <Mail size={13} className="absolute left-2.5 top-3.5 text-stone-500" />
                </div>
                <button
                  id="newsletter-submit"
                  type="submit"
                  className="px-4 bg-stone-100 hover:bg-stone-200 text-stone-950 font-sans text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>

              {isSubscribed && (
                <p id="newsletter-success-msg" className="text-[10px] text-emerald-400 font-sans font-medium">
                  ✓ Enrolled! Your 15% code "WAYWARD" is waiting in your inbox.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Credits / Compliance logos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left text-[11px] text-stone-500 font-sans space-y-1">
            <p>© 2026 Everly Wayward Ltd. All global rights reserved.</p>
            <p className="font-light">Premium ready-to-wear garments shipped internationally with carbon neutral delivery systems.</p>
          </div>

          {/* Card networks badges */}
          <div className="flex items-center gap-3 text-stone-500 text-xs">
            <div className="flex items-center gap-1 border border-stone-800 px-2.5 py-1 rounded-sm bg-stone-900/50">
              <ShieldCheck size={12} className="text-stone-400" />
              <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-stone-400">SSL Secures</span>
            </div>
            <span className="font-mono text-[9px] border border-stone-800 px-1.5 py-0.5 rounded-sm">VISA</span>
            <span className="font-mono text-[9px] border border-stone-800 px-1.5 py-0.5 rounded-sm">MC</span>
            <span className="font-mono text-[9px] border border-stone-800 px-1.5 py-0.5 rounded-sm">AMEX</span>
            <span className="font-mono text-[9px] border border-stone-800 px-1.5 py-0.5 rounded-sm"> PAY</span>
            <span className="font-mono text-[9px] border border-stone-800 px-1.5 py-0.5 rounded-sm">G PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
