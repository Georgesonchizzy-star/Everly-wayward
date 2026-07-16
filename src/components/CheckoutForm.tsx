import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, CheckCircle, ShieldCheck, Truck, Lock, ChevronRight, Compass } from 'lucide-react';
import { CartItem, ShippingDetails, PaymentDetails } from '../types';

interface CheckoutFormProps {
  cartItems: CartItem[];
  promoDiscount: number;
  promoCode: string;
  onCancel: () => void;
  onOrderCompleted: (shipping: ShippingDetails, payment: PaymentDetails, totals: { subtotal: number; discount: number; shippingCost: number; tax: number; total: number }) => void;
}

export default function CheckoutForm({
  cartItems,
  promoDiscount,
  promoCode,
  onCancel,
  onOrderCompleted,
}: CheckoutFormProps) {
  // Wizard steps: 'shipping' | 'payment' | 'processing'
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [shipping, setShipping] = useState<ShippingDetails>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const [payment, setPayment] = useState<PaymentDetails>({
    method: 'card',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'generic'>('generic');

  // Detect card brand from digits typed
  useEffect(() => {
    const rawDigits = payment.cardNumber?.replace(/\D/g, '') || '';
    if (rawDigits.startsWith('4')) {
      setCardBrand('visa');
    } else if (/^5[1-5]/.test(rawDigits)) {
      setCardBrand('mastercard');
    } else if (/^3[47]/.test(rawDigits)) {
      setCardBrand('amex');
    } else {
      setCardBrand('generic');
    }
  }, [payment.cardNumber]);

  // Format Card Number input with appropriate spacing
  const handleCardNumberChange = (value: string) => {
    let digits = value.replace(/\D/g, '');
    let formatted = '';
    
    if (cardBrand === 'amex') {
      // Amex layout: 4-6-5 digits
      if (digits.length > 15) digits = digits.slice(0, 15);
      if (digits.length > 4) {
        formatted += digits.slice(0, 4) + ' ';
        if (digits.length > 10) {
          formatted += digits.slice(4, 10) + ' ' + digits.slice(10);
        } else {
          formatted += digits.slice(4);
        }
      } else {
        formatted = digits;
      }
    } else {
      // Standard layout: 4-4-4-4 digits
      if (digits.length > 16) digits = digits.slice(0, 16);
      const chunks = digits.match(/.{1,4}/g);
      formatted = chunks ? chunks.join(' ') : '';
    }

    setPayment({ ...payment, cardNumber: formatted });
  };

  // Format Expiration Date input MM/YY
  const handleExpiryChange = (value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
    
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    setPayment({ ...payment, expiryDate: formatted });
  };

  // Calculations
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const discount = (subtotal * promoDiscount) / 100;
  const shippingCost = deliveryMethod === 'express' ? 15.00 : 0.00;
  const tax = (subtotal - discount) * 0.0825; // 8.25% state sales tax
  const total = subtotal - discount + shippingCost + tax;

  // Validation
  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!shipping.email || !emailRegex.test(shipping.email)) errors.email = 'Valid email required';
    if (!shipping.firstName.trim()) errors.firstName = 'First name required';
    if (!shipping.lastName.trim()) errors.lastName = 'Last name required';
    if (!shipping.address.trim()) errors.address = 'Street address required';
    if (!shipping.city.trim()) errors.city = 'City required';
    if (!shipping.state.trim()) errors.state = 'State / Region required';
    if (!shipping.zipCode.trim() || shipping.zipCode.length < 5) errors.zipCode = 'Valid ZIP required';
    if (!shipping.phone.trim() || shipping.phone.replace(/\D/g, '').length < 7) errors.phone = 'Valid phone required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};
    
    if (payment.method === 'card') {
      const cardDigits = payment.cardNumber?.replace(/\D/g, '') || '';
      const expiryClean = payment.expiryDate?.replace(/\D/g, '') || '';

      if (!payment.cardName?.trim()) errors.cardName = 'Name on card is required';
      
      const expectedCardLength = cardBrand === 'amex' ? 15 : 16;
      if (cardDigits.length !== expectedCardLength) {
        errors.cardNumber = `Card number must be ${expectedCardLength} digits`;
      }
      
      if (expiryClean.length !== 4) {
        errors.expiryDate = 'Expiration must be MM/YY';
      } else {
        const month = parseInt(expiryClean.slice(0, 2));
        if (month < 1 || month > 12) errors.expiryDate = 'Invalid month';
      }

      if (!payment.cvv || payment.cvv.replace(/\D/g, '').length < 3) {
        errors.cvv = 'CVV code required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'shipping') {
      if (validateShippingForm()) {
        setStep('payment');
        setFormErrors({});
      }
    }
  };

  const handleCompleteOrder = () => {
    if (validatePaymentForm()) {
      setIsProcessing(true);
      
      // Simulate real bank authorization delays
      setTimeout(() => {
        setIsProcessing(false);
        onOrderCompleted(
          shipping,
          payment,
          { subtotal, discount, shippingCost, tax, total }
        );
      }, 1800);
    }
  };

  const handleExpressPayment = (method: 'paypal' | 'applepay' | 'googlepay') => {
    setIsProcessing(true);
    
    // Seed dummy shipping info for express wallet click-throughs
    const mockShipping: ShippingDetails = {
      email: 'georgesonchizzy@gmail.com',
      firstName: 'George',
      lastName: 'Son',
      address: '100 Everly Boulevard',
      apartment: 'Suite 4B',
      city: 'Austin',
      state: 'Texas',
      zipCode: '78701',
      phone: '+1 (512) 555-1234',
    };

    const mockPayment: PaymentDetails = {
      method,
    };

    setTimeout(() => {
      setIsProcessing(false);
      onOrderCompleted(
        mockShipping,
        mockPayment,
        { subtotal, discount, shippingCost, tax, total }
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-100 py-12 pt-28">
      {/* Absolute Loading Backdrop during processing */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="text-amber-400 mb-6"
            >
              <Compass size={48} />
            </motion.div>
            <h3 className="font-serif text-xl font-bold tracking-wider uppercase mb-2 text-stone-100">
              Securing Transaction
            </h3>
            <p className="font-sans text-xs text-stone-400 tracking-wide animate-pulse">
              Please wait while our payment gateway authorizes your credit line...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wizard Header Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-stone-200">
          <div>
            <button
              id="back-to-bag-btn"
              onClick={onCancel}
              className="text-xs font-sans uppercase tracking-wider text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer transition-colors"
            >
              ← Back to Shopping Bag
            </button>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-2">Everly Checkout</h2>
          </div>

          {/* Stepper bubbles */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-bold flex items-center gap-1.5 transition-colors ${
                step === 'shipping'
                  ? 'bg-stone-900 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {step !== 'shipping' ? <CheckCircle size={14} /> : '1'}
              Shipping Info
            </span>
            <ChevronRight size={14} className="text-stone-400" />
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-bold flex items-center gap-1.5 transition-colors ${
                step === 'payment'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-200 text-stone-500'
              }`}
            >
              2
              Payment Methods
            </span>
          </div>
        </div>

        {/* Outer Split Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Shipping Form or Payment options */}
          <div className="lg:col-span-7 space-y-6">
            {/* Express checkout triggers */}
            {step === 'shipping' && (
              <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-stone-700">Express Checkout</span>
                  <span className="text-[10px] text-stone-400 font-sans flex items-center gap-1">
                    <ShieldCheck size={12} /> SSL Secured
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Mock PayPal Button */}
                  <button
                    id="express-paypal-btn"
                    onClick={() => handleExpressPayment('paypal')}
                    className="py-3 px-4 rounded-xs bg-amber-400 hover:bg-amber-300 font-bold text-stone-800 text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    Pay<span className="text-indigo-800 italic">Pal</span>
                  </button>

                  {/* Mock Apple Pay Button */}
                  <button
                    id="express-applepay-btn"
                    onClick={() => handleExpressPayment('applepay')}
                    className="py-3 px-4 rounded-xs bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                     Pay
                  </button>

                  {/* Mock Google Pay Button */}
                  <button
                    id="express-googlepay-btn"
                    onClick={() => handleExpressPayment('googlepay')}
                    className="py-3 px-4 rounded-xs bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-medium text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    Google Pay
                  </button>
                </div>
                <div className="relative text-center py-2">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <span className="relative bg-white px-4 text-xs font-sans text-stone-400 uppercase tracking-widest">
                    Or Continue below
                  </span>
                </div>
              </div>
            )}

            {/* Stepper Step 1: Shipping Info Form */}
            {step === 'shipping' && (
              <form onSubmit={handleNextStep} className="bg-white p-6 sm:p-8 rounded-sm border border-stone-200 shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Shipping Destination</h3>
                  <p className="text-xs font-sans text-stone-500">Provide the physical destination for your carefully tailored garments.</p>
                </div>

                <div className="space-y-4">
                  {/* Contact Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                        formErrors.email ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                      }`}
                      placeholder="e.g. wanderer@everly.com"
                    />
                    {formErrors.email && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.email}</p>}
                  </div>

                  {/* First / Last Name split */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={shipping.firstName}
                        onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                        className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                          formErrors.firstName ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                        }`}
                        placeholder="John"
                      />
                      {formErrors.firstName && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={shipping.lastName}
                        onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                        className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                          formErrors.lastName ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                        }`}
                        placeholder="Doe"
                      />
                      {formErrors.lastName && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Street Address *
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                        formErrors.address ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                      }`}
                      placeholder="123 Wilderness Trail"
                    />
                    {formErrors.address && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.address}</p>}
                  </div>

                  {/* Apartment / Suite */}
                  <div>
                    <label htmlFor="apartment" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Apartment, Suite, Unit (Optional)
                    </label>
                    <input
                      id="apartment"
                      type="text"
                      value={shipping.apartment}
                      onChange={(e) => setShipping({ ...shipping, apartment: e.target.value })}
                      className="w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-800"
                      placeholder="Apt 4B"
                    />
                  </div>

                  {/* City / State / Zip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                          formErrors.city ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                        }`}
                        placeholder="Austin"
                      />
                      {formErrors.city && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.city}</p>}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        State / Region *
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                          formErrors.state ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                        }`}
                        placeholder="Texas"
                      />
                      {formErrors.state && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.state}</p>}
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        ZIP Code *
                      </label>
                      <input
                        id="zipCode"
                        type="text"
                        value={shipping.zipCode}
                        onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                        className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                          formErrors.zipCode ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                        }`}
                        placeholder="78701"
                      />
                      {formErrors.zipCode && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.zipCode}</p>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="text"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                        formErrors.phone ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                      }`}
                      placeholder="+1 (512) 555-1234"
                    />
                    {formErrors.phone && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                {/* Delivery Options Subform */}
                <div className="pt-6 border-t border-stone-100">
                  <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1">
                    <Truck size={14} /> Shipping Speed
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      id="shipping-speed-standard"
                      type="button"
                      onClick={() => setDeliveryMethod('standard')}
                      className={`p-4 border rounded-xs text-left transition-all duration-200 cursor-pointer ${
                        deliveryMethod === 'standard'
                          ? 'border-stone-900 bg-stone-50 shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-sans font-bold text-xs text-stone-900 uppercase">Standard Delivery</span>
                        <span className="font-sans font-bold text-xs text-emerald-800 uppercase">Free</span>
                      </div>
                      <p className="text-[10px] text-stone-500 font-sans leading-relaxed">Delivers in 3-5 business days securely wrapped in biodegradable pulps.</p>
                    </button>

                    <button
                      id="shipping-speed-express"
                      type="button"
                      onClick={() => setDeliveryMethod('express')}
                      className={`p-4 border rounded-xs text-left transition-all duration-200 cursor-pointer ${
                        deliveryMethod === 'express'
                          ? 'border-stone-900 bg-stone-50 shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-sans font-bold text-xs text-stone-900 uppercase">Expedited Air</span>
                        <span className="font-sans font-bold text-xs text-stone-900">$15.00</span>
                      </div>
                      <p className="text-[10px] text-stone-500 font-sans leading-relaxed">Delivers in 1-2 business days with priority premium trackable handling.</p>
                    </button>
                  </div>
                </div>

                {/* Submit to Next */}
                <button
                  id="checkout-next-btn"
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  Proceed to Payment Options
                  <ChevronRight size={14} />
                </button>
              </form>
            )}

            {/* Stepper Step 2: Payment options Selection */}
            {step === 'payment' && (
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-stone-200 shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Billing Details</h3>
                  <p className="text-xs font-sans text-stone-500">All transactions are fully encrypted, protected under 256-bit secure sockets.</p>
                </div>

                {/* Tabs to select card, paypal etc */}
                <div className="grid grid-cols-2 gap-2 border-b border-stone-100 pb-4">
                  <button
                    id="payment-tab-card"
                    onClick={() => setPayment({ ...payment, method: 'card' })}
                    className={`py-2.5 text-xs font-sans font-bold uppercase tracking-wider text-center border rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      payment.method === 'card'
                        ? 'border-stone-900 bg-stone-950 text-white'
                        : 'border-stone-200 text-stone-500 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <CreditCard size={14} />
                    Credit Card
                  </button>
                  
                  <button
                    id="payment-tab-express"
                    onClick={() => setPayment({ ...payment, method: 'paypal' })}
                    className={`py-2.5 text-xs font-sans font-bold uppercase tracking-wider text-center border rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      payment.method !== 'card'
                        ? 'border-stone-900 bg-stone-950 text-white'
                        : 'border-stone-200 text-stone-500 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <Lock size={14} />
                    Express Wallet
                  </button>
                </div>

                {payment.method === 'card' ? (
                  <div className="space-y-4">
                    {/* Card Brand display helper */}
                    <div className="flex justify-between items-center bg-stone-50 border border-stone-200/80 p-3 rounded-xs text-xs">
                      <span className="font-sans text-stone-600 font-medium uppercase tracking-wider">Identified Provider:</span>
                      <span className="font-mono text-stone-900 font-bold uppercase tracking-widest text-sm flex items-center gap-1">
                        {cardBrand === 'visa' && '💳 VISA'}
                        {cardBrand === 'mastercard' && '💳 MASTERCARD'}
                        {cardBrand === 'amex' && '💳 AMEX'}
                        {cardBrand === 'generic' && '💳 CARD DECLARED'}
                      </span>
                    </div>

                    {/* Name on Card */}
                    <div>
                      <label htmlFor="cardName" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Name on Card *
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        value={payment.cardName || ''}
                        onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                        className={`w-full text-sm font-sans px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                          formErrors.cardName ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.cardName && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.cardName}</p>}
                    </div>

                    {/* Card Number */}
                    <div>
                      <label htmlFor="cardNumber" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Card Number *
                      </label>
                      <div className="relative">
                        <input
                          id="cardNumber"
                          type="text"
                          value={payment.cardNumber || ''}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          className={`w-full text-sm font-mono px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                            formErrors.cardNumber ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                          }`}
                          placeholder={cardBrand === 'amex' ? 'XXXX XXXXXX XXXXX' : 'XXXX XXXX XXXX XXXX'}
                        />
                        <CreditCard size={18} className="absolute right-3.5 top-3 text-stone-400" />
                      </div>
                      {formErrors.cardNumber && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.cardNumber}</p>}
                    </div>

                    {/* Expiry / CVV Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                          Expiration Date *
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={payment.expiryDate || ''}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          className={`w-full text-sm font-mono px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                            formErrors.expiryDate ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                          }`}
                          placeholder="MM/YY"
                        />
                        {formErrors.expiryDate && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.expiryDate}</p>}
                      </div>

                      <div>
                        <label htmlFor="cvv" className="block text-xs font-sans font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                          CVV Security Code *
                        </label>
                        <input
                          id="cvv"
                          type="password"
                          value={payment.cvv || ''}
                          onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          className={`w-full text-sm font-mono px-3.5 py-2.5 rounded-xs border focus:outline-none focus:ring-1 text-stone-800 ${
                            formErrors.cvv ? 'border-rose-600 focus:ring-rose-500' : 'border-stone-300 focus:ring-stone-900'
                          }`}
                          placeholder={cardBrand === 'amex' ? '1234' : '123'}
                        />
                        {formErrors.cvv && <p className="text-rose-600 text-[10px] font-sans mt-1">{formErrors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 text-center">
                    <p className="text-xs font-sans text-stone-600 max-w-sm mx-auto mb-6 leading-relaxed">
                      You have chosen express authorization. Completing checkout will pull credentials instantly from your logged-in wallet securely.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                      <button
                        id="paypal-complete-btn"
                        type="button"
                        onClick={() => handleExpressPayment('paypal')}
                        className="py-3 px-4 bg-amber-400 hover:bg-amber-300 font-bold text-stone-900 font-sans text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-sm transition-colors"
                      >
                        Express PayPal
                      </button>
                      <button
                        id="applepay-complete-btn"
                        type="button"
                        onClick={() => handleExpressPayment('applepay')}
                        className="py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-sm transition-all"
                      >
                         Express Pay
                      </button>
                    </div>
                  </div>
                )}

                {/* Back / Secure Pay buttons */}
                <div className="flex gap-4 pt-6 border-t border-stone-100">
                  <button
                    id="payment-back-btn"
                    type="button"
                    onClick={() => {
                      setStep('shipping');
                      setFormErrors({});
                    }}
                    className="px-6 py-4 border border-stone-300 hover:bg-stone-50 text-stone-700 font-sans text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    id="complete-order-btn"
                    type="button"
                    onClick={handleCompleteOrder}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-sans font-bold text-xs tracking-widest uppercase py-4 rounded-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Lock size={13} />
                    Secure Purchase (${total.toFixed(2)})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive Totals & Order summary */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-stone-200 rounded-sm shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Your Order Summary</h3>
              <p className="text-xs font-sans text-stone-400">Review selected styles before concluding purchase.</p>
            </div>

            {/* List items scrollbox */}
            <div className="max-h-72 overflow-y-auto pr-1 space-y-3.5 border-b border-stone-100 pb-5">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3 text-xs">
                  <div className="w-12 aspect-[3/4] bg-stone-100 rounded-xs overflow-hidden border shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-bold text-stone-800 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-stone-400 font-sans uppercase tracking-wider mt-0.5">
                      Qty: {item.quantity} · Size: {item.selectedSize} · Color: {item.selectedColor.name}
                    </p>
                  </div>
                  <span className="font-sans font-bold text-stone-900 shrink-0 ml-1">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Dynamic totals section */}
            <div className="space-y-3 font-sans text-xs text-stone-700 border-b border-stone-100 pb-5">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} Items)</span>
                <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({promoDiscount}% Off: "{promoCode}")</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Method ({deliveryMethod === 'express' ? 'Priority Air' : 'Standard Priority'})</span>
                <span className="font-semibold text-stone-900">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sales Tax (8.25% State Tax)</span>
                <span className="font-semibold text-stone-900">${tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Grand absolute total */}
            <div className="flex justify-between font-sans font-bold text-stone-900 text-lg">
              <span>Grand Total</span>
              <span className="text-xl text-amber-950">${total.toFixed(2)}</span>
            </div>

            {/* Credential compliance box */}
            <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xs flex gap-3 text-[11px] text-stone-500 font-sans font-light leading-relaxed">
              <ShieldCheck size={28} className="text-stone-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-800 uppercase tracking-wider mb-0.5">Streamlined Payment Guarantee</p>
                <p>Everly Wayward runs an authorized payment layer ensuring no storage of raw CVVs. Standard fraud protection actively shields this session.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
