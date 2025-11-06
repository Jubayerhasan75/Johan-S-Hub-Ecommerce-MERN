// --- Ei file-ti apnar deya shob file-ke "sync" korbe ---

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

// --- Cart Type ---
export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

// --- Auth Types (Apnar "Niom" Onusare) ---
export type UserInfo = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

export type AdminUserInfo = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

// --- Order Type ---
export type Order = {
  _id: string;
  user: { _id: string; name: string; email: string; };
  customerInfo: { name: string; phone: string; email: string; };
  orderItems: {
    name: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
    imageUrl: string;
    product: string;
  }[];
  shippingAddress: { address: string; city: string; };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  paymentMethod: string;
  transactionId?: string;
};

// --- AppContextType (Apnar "Niom" Onusare) ---
export interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;

  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // --- Regular User Auth ---
  userInfo: UserInfo | null;
  loginUser: (userData: UserInfo) => void;
  logoutUser: () => void;
  
  // --- Admin Auth ---
  adminUserInfo: AdminUserInfo | null;
  loginAdmin: (adminData: AdminUserInfo) => void;
  logoutAdmin: () => void;
}