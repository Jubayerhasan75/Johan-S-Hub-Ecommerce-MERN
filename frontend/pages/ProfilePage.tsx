import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Order } from '../types';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../constants'; 

const ProfilePage: React.FC = () => {
  
  const { userInfo, logout } = useAppContext();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (userInfo.isAdmin) {
      navigate('/admin/dashboard');
      return;
    }

    const fetchMyOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch your orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  if (loading || !userInfo) {
    return <div className="p-10 text-center"><Loader2 size={40} className="animate-spin text-brand-accent" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        <div className="md:col-span-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Profile</h1>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="break-words"> 
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold">{userInfo.name}</p>
            </div>
            <div className="break-words">
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg font-semibold">{userInfo.email}</p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Order History</h2>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-6">
            {loading ? (
              <div className="text-center"><Loader2 size={32} className="animate-spin" /></div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">You have not placed any orders yet.</div>
            ) : (
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">...{order._id.substring(18)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">৳{order.totalPrice}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {order.isPaid ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <XCircle size={16} className="mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {order.isDelivered ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-600">
                              <XCircle size={16} className="mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Link to={`/order/${order._id}`} className="text-brand-dark hover:underline">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;