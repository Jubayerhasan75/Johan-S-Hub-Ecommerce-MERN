// --- Ei file-ti-i shob error fix korbe ---

// --- Product Type ---
export type Product = {
  _id: string; // Not 'id', it's '_id'
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

// --- User/Admin Type ---
// Ekhon 2-dhoroner UserInfo ache
export type UserInfo = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

export type AdminUserInfo = { // Apnar AdminLoginPage.tsx onusare
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

// --- Order Type ---
// Ami ekhane paymentMethod field-gulo jog kore dichchi, ja porobortite lagbe
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
  // --- Manual Payment Fields ---
  paymentMethod: string;
  transactionId?: string;
};

// --- AppContextType (Apnar AppContext.tsx Onusare) ---
export interface AppContextType {
  cart: CartItem[];
  // Apnar AppContext.tsx bolche addToCart 3-ta jinis ney
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;

  favorites: Product[];
  // Apnar ProductCard.tsx ei function-gulo khujche
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // --- Auth (Apnar Navbar/AdminDashboard onusare) ---
  userInfo: UserInfo | null;
  loginUser: (userData: UserInfo) => void;
  logoutUser: () => void;
  
  // --- Admin Auth (Apnar AdminDashboard onusare) ---
  adminUserInfo: AdminUserInfo | null;
  loginAdmin: (adminData: AdminUserInfo) => void;
  logoutAdmin: () => void;
}