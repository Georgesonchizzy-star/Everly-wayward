export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'men' | 'women' | 'children';
  collection: string;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: Color[];
  rating: number;
  reviewsCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: Color;
  quantity: number;
}

export interface ShippingDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface PaymentDetails {
  method: 'card' | 'paypal' | 'applepay' | 'googlepay';
  cardName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingDetails;
  payment: PaymentDetails;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
}
