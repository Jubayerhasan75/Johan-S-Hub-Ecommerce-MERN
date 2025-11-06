import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { Order } from '../types';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart, userInfo, updateQuantity, removeFromCart } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    } else {
      navigate('/login?redirect=/checkout');
    }
  }, [userInfo, navigate]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 1000 ? 0 : 60;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!userInfo || !userInfo.token) { // Token check
      setError('You must be logged in to place an order.');
      navigate('/login?redirect=/checkout'); 
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setLoading(true);

    const orderData = {
      customerInfo: { name, phone, email },
      orderItems: cart.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        product: item.product._id,
      })),
      shippingAddress: { address, city },
      totalPrice: total,
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // --- ⛔️ Shothik Fix: Token-ti ekhon pathano hocche ---
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(orderData),
      });
      const newOrderData = await response.json();
      if (!response.ok) {
        throw new Error(newOrderData.message || 'Failed to place order');
      }
      
      setLoading(false);
      clearCart();
      navigate('/thankyou');

    } catch (err) {
      console.error('Order placement error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout & Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center text-xl text-gray-600">Your cart is empty.</div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b pb-4 last:border-b-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-1">
                      <h4 className="text-md font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">Size: {item.size}, Color: {item.color}</p>
                      <p className="text-lg font-semibold text-brand-dark">৳{item.product.price}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                        className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                        className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product._id, item.size, item.color)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="bg-white p-8 rounded-lg shadow-md space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
              {error && <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-gray-50" readOnly={!!userInfo} />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-gray-50" readOnly={!!userInfo} />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
                  <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="e.g. House 123, Road 4" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g. Dhaka" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-md h-fit sticky top-24">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
              <div className="flex justify-between text-md">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-md">
                <span>Shipping</span>
                <span>৳{shippingFee}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-brand-dark mt-2">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-6 py-3 bg-brand-dark text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : 'Place Order (Cash on Delivery)'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;