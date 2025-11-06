// --- Product Type ---
export type Product = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  description: string;
  countInStock: number;
  colors: string[];
  sizes: string[];
  createdAt?: string;
  updatedAt?: string;
};

// --- Order Types ---
export type OrderItem = {
  name: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  imageUrl: string;
  product: string; // Product ID
};

export type ShippingAddress = {
  address: string;
  city: string;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
};

// --- NOTUN PAYMENT FIELD JOG KORA HOYECHE ---
export type Order = {
  _id: string;
  user: { _id: string; name: string; email: string; };
  customerInfo: CustomerInfo;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  
  // --- Payment Fields (Notun) ---
  paymentMethod: string;
  transactionId?: string; // Optional
  isPaid: boolean;
  paidAt?: string; // Optional
  // ---

  isDelivered: boolean;
  deliveredAt?: string; // Optional
  createdAt: string;
};

// --- User Type ---
export type UserInfo = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

// --- Cart Type ---
export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};


export type AppContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  userInfo: UserInfo | null;
  login: (data: UserInfo) => void; 
  logout: () => void; 
};