'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaCar,
  FaDollarSign,
  FaClipboardList,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from 'react-icons/fa';

/**
 * Admin Dashboard overview page
 */
export default function AdminPage() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    soldCars: 0,
    totalEMI: 0,
    pendingSellRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [carsRes, emiRes, sellRes] = await Promise.all([
          fetch('/api/cars?limit=1'),
          fetch('/api/emi'),
          fetch('/api/sell'),
        ]);
        const carsData = await carsRes.json();
        const emiData = await emiRes.json();
        const sellData = await sellRes.json();

        setStats({
          totalCars: carsData.pagination?.total || 0,
          availableCars: 0,
          soldCars: 0,
          totalEMI: emiData.emi?.length || 0,
          pendingSellRequests: sellData.requests?.filter((r) => r.status === 'pending').length || 0,
        });
      } catch (error) {
        console.error('Failed to load admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Cars',
      value: stats.totalCars,
      icon: FaCar,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/cars',
    },
    {
      title: 'Active EMIs',
      value: stats.totalEMI,
      icon: FaDollarSign,
      color: 'from-green-500 to-green-600',
      link: '/admin/emi',
    },
    {
      title: 'Pending Sell Requests',
      value: stats.pendingSellRequests,
      icon: FaClipboardList,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/sell-requests',
    },
    {
      title: 'Total Revenue',
      value: '—',
      icon: FaChartLine,
      color: 'from-purple-500 to-purple-600',
      link: '#',
    },
  ];

  const quickLinks = [
    { label: 'Manage Cars', href: '/admin/cars', icon: FaCar, desc: 'Add, edit, or remove car listings' },
    { label: 'EMI Plans', href: '/admin/emi', icon: FaDollarSign, desc: 'View and manage active EMI plans' },
    { label: 'Sell Requests', href: '/admin/sell-requests', icon: FaClipboardList, desc: 'Review pending sell submissions' },
  ];

  return (
    <div className="min-h-screen bg-surface py-8 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
              Admin <span className="text-primary-600">Dashboard</span>
            </h1>
            <p className="text-gray-500 mt-2">Manage your premium car marketplace</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-bold text-gray-700 shadow-sm border border-gray-100 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> System Online
            </span>
            <span className="text-sm text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map(({ title, value, icon: Icon, color, link }) => (
            <Link
              key={title}
              href={link}
              className="bg-white rounded-[1.5rem] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  <FaArrowRight className="w-3 h-3 -rotate-45" />
                </div>
              </div>
              <p className="text-gray-500 font-medium mb-1 relative z-10">{title}</p>
              <p className="text-4xl font-black text-gray-900 font-display tracking-tight relative z-10">
                {loading ? (
                  <span className="inline-block w-16 h-10 bg-gray-100 rounded-lg animate-pulse" />
                ) : (
                  value
                )}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          {/* Main Chart Area */}
          <div className="xl:col-span-2 bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-display">Revenue Overview</h2>
                <p className="text-sm text-gray-500">Monthly sales performance</p>
              </div>
              <select className="bg-gray-50 border-none text-sm font-bold text-gray-700 rounded-xl px-4 py-2 focus:ring-0 cursor-pointer">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex-1 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
               <FaChartLine className="w-12 h-12 text-gray-300 mb-4" />
               <p className="text-gray-500 font-medium">Chart visualization will appear here</p>
               <p className="text-xs text-gray-400 mt-1">Connect analytical tools to view insights</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900 font-display">Recent Activity</h2>
              <button className="text-primary-600 text-sm font-bold hover:underline">View All</button>
            </div>
            
            <div className="space-y-6">
              {[
                { icon: FaCar, color: 'text-blue-500', bg: 'bg-blue-50', text: 'New listing added: Porsche 911', time: '2 hours ago' },
                { icon: FaDollarSign, color: 'text-green-500', bg: 'bg-green-50', text: 'EMI Application Approved', time: '5 hours ago' },
                { icon: FaUsers, color: 'text-purple-500', bg: 'bg-purple-50', text: 'New user registration', time: '1 day ago' },
                { icon: FaExclamationCircle, color: 'text-orange-500', bg: 'bg-orange-50', text: 'System update completed', time: '2 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0 mt-1`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">{activity.text}</p>
                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 font-display mb-6 border-b border-gray-100 pb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={label}
                href={href}
                className="flex items-start gap-5 p-5 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-[1rem] bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 group-hover:text-primary-700 text-lg">{label}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
