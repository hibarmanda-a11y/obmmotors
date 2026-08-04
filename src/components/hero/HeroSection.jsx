'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaArrowRight, FaCar, FaShieldAlt, FaStar } from 'react-icons/fa';

/**
 * Hero Section - Main landing area with animated gradient background,
 * search functionality, and key statistics
 */
export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { label: 'Cars Available', value: '1,200+', icon: FaCar },
    { label: 'Happy Customers', value: '8,500+', icon: FaStar },
    { label: 'Verified Dealers', value: '350+', icon: FaShieldAlt },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm mb-6 backdrop-blur-sm">
              <FaStar className="w-3 h-3 mr-2 text-yellow-400" />
              #1 Premium Car Marketplace
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Dream Car
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              Browse premium vehicles, compare prices, and drive home your dream car with flexible financing options.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by make, model, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              <Link
                href={searchTerm ? `/buy?search=${encodeURIComponent(searchTerm)}` : '/buy'}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Search</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3 mb-10">
              {['Mercedes', 'BMW', 'Tesla', 'Porsche', 'Audi'].map((make) => (
                <Link
                  key={make}
                  href={`/buy?make=${make}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {make}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
                      <Icon className="w-4 h-4 text-blue-400" />
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Car Image / Visual */}
          <div
            className={`hidden lg:block transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-3xl scale-110" />

              {/* Car showcase card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 mb-6">
                  <Image
                    src="https://i.ibb.co.com/ycpGzNS2/e6d455913972f456466501091edd9501.png"
                    alt="Featured Premium Car"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  2024 Mercedes-Benz EQS 580
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    $125,000
                  </span>
                  <Link
                    href="/buy"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                  >
                    <span>View All</span>
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
    </section>
  );
}
