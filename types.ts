
export interface ProductMedia {
  url: string;
  type: 'image' | 'video';
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ProductVariation {
  id: string;
  name: string; // e.g., "Red", "Large", "XL"
  price?: number; // Optional override for this specific variation
  stock: number;
  mediaIndex?: number; // Optional specific image for this variation
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  media: ProductMedia[];
  primaryIndex: number;
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  stock: number;
  createdAt: number;
  isFlashSale?: boolean;
  variations?: ProductVariation[];
}

export interface Order {
  id: string;
  date: number;
  status: OrderStatus;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: 'Card' | 'Mobile Banking' | 'COD';
  productNames: string[];
  items: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  wishlist?: string[]; // array of product IDs
  orders?: Order[];
  points?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariation?: ProductVariation;
}

export type Category = 'All' | 'Personalized' | 'Birthday' | 'Wedding' | 'Home Decor' | 'Accessories';

export const CATEGORIES: Category[] = ['All', 'Personalized', 'Birthday', 'Wedding', 'Home Decor', 'Accessories'];

export const SHOP_INFO = {
  name: "Precious Moments Gift Shop",
  address: "House 45, Road 12, Sector 7, Uttara, Dhaka, Bangladesh",
  googleMapsUrl: "https://maps.app.goo.gl/3Xp5wW8Z5M8A",
  phone: "+8801700000000",
  whatsapp: "+8801700000000"
};
