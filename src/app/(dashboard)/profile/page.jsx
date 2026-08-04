// /app/(dashboard)/profile/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCar, 
  FaCreditCard,
  FaHistory,
  FaEdit,
  FaSave,
  FaTimes,
  FaDollarSign,
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaProjectDiagram,
  FaShareAlt,
  FaStar,
  FaInfoCircle,
  FaArrowRight,
  FaUserCircle,
  FaCog
} from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * User Profile page - Shows user information, orders, and EMI details
 */
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [orders, setOrders] = useState([]);
  const [emiDetails, setEmiDetails] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const userResponse = await fetch('/api/user/profile');
        
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }
        
        const userData = await userResponse.json();
        
        if (!userData.user) {
          throw new Error('User data not found in response');
        }
        
        const userDataObj = userData.user;
        setUser(userDataObj);
        setEditForm({
          name: userDataObj.name || '',
          phone: userDataObj.phone || '',
          address: userDataObj.address || '',
        });

        // Fetch user orders
        try {
          const ordersResponse = await fetch('/api/user/orders');
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setOrders(ordersData.orders || []);
          } else {
            console.warn('Failed to fetch orders');
            setOrders([]);
          }
        } catch (orderError) {
          console.warn('Error fetching orders:', orderError);
          setOrders([]);
        }

        // Fetch EMI details
        try {
          const emiResponse = await fetch('/api/user/emi');
          if (emiResponse.ok) {
            const emiData = await emiResponse.json();
            setEmiDetails(emiData.emi || []);
          } else {
            console.warn('Failed to fetch EMI details');
            setEmiDetails([]);
          }
        } catch (emiError) {
          console.warn('Error fetching EMI details:', emiError);
          setEmiDetails([]);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'Failed to load profile data');
        toast.error(error.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [status]);

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('No user data returned after update');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 bg-gray-200 rounded"></div>
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 max-w-md mx-auto">
            <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Profile</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-700">User not found</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Navigation items
  const navItems = [
    { id: 'projects', label: 'My projects', icon: FaProjectDiagram },
    { id: 'account', label: 'Account', icon: FaUserCircle },
    { id: 'share', label: 'Share with friends', icon: FaShareAlt },
    { id: 'review', label: 'Review', icon: FaStar },
    { id: 'info', label: 'Info', icon: FaInfoCircle },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 max-w-4xl py-6 md:py-10">
        {/* Welcome Heading */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome to <span className="text-blue-600">Car Sawari</span>
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8 mb-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
                >
                  <FaEdit className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              
              {/* User Info */}
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                {user.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <FaPhone className="w-3 h-3" />
                    {user.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 md:ml-auto mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-gray-800">{orders.length}</div>
                <div className="text-xs text-gray-500">Orders</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-gray-800">{emiDetails.length}</div>
                <div className="text-xs text-gray-500">Active EMIs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 md:gap-2 mb-8 border-b border-gray-100 pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm md:text-base font-medium rounded-2xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Profile Edit Section */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                  >
                    <FaTimes className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl transition-all duration-200"
                  >
                    <FaSave className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-3 text-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 py-2 border-b border-gray-50">
                  <span className="font-medium text-gray-500 w-24">Name</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 py-2 border-b border-gray-50">
                  <span className="font-medium text-gray-500 w-24">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 py-2 border-b border-gray-50">
                  <span className="font-medium text-gray-500 w-24">Phone</span>
                  <span>{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 py-2">
                  <span className="font-medium text-gray-500 w-24">Address</span>
                  <span>{user.address || 'Not provided'}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* EMI Details */}
          {emiDetails.length > 0 && (
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-gray-800">
                <FaCreditCard className="text-blue-600" />
                <span>EMI Details</span>
              </h3>
              <div className="space-y-4">
                {emiDetails.map((emi, index) => (
                  <div key={index} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{emi.carTitle || 'Car'}</h4>
                        <p className="text-sm text-gray-500">Tenure: {emi.tenureMonths} months</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold self-start ${
                        emi.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : emi.status === 'defaulted'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {emi.status.charAt(0).toUpperCase() + emi.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-xs text-gray-500">Monthly Payment</p>
                        <p className="font-semibold text-gray-800">{formatPrice(emi.monthlyPayment)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Paid</p>
                        <p className="font-semibold text-gray-800">{formatPrice(emi.totalPaid)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Remaining</p>
                        <p className="font-semibold text-orange-600">{formatPrice(emi.remainingBalance)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Next Payment</p>
                        <p className="font-semibold text-gray-800">{formatDate(emi.nextPaymentDue)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order History */}
          {orders.length > 0 && (
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-gray-800">
                <FaHistory className="text-blue-600" />
                <span>Order History</span>
              </h3>
              <div className="space-y-3">
                {orders.map((order, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors gap-2">
                    <div>
                      <p className="font-medium text-gray-800">{order.carTitle || 'Car'}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.purchaseDate)}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <p className="font-semibold text-gray-800">{formatPrice(order.amount)}</p>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        order.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}