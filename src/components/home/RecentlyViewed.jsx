'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaArrowRight } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';

export default function RecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  useEffect(() => {
    // In a real app, this would be fetched from localStorage based on user's browsing history
    // We mock it for UI demonstration
    setRecentlyViewed([
      {
        _id: '1',
        title: '2024 BMW M4 Competition',
        price: 89900,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80',
        viewedAt: '2 hours ago',
      },
      {
        _id: '3',
        title: '2023 Audi RS6 Avant',
        price: 125000,
        image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=400&q=80',
        viewedAt: '5 hours ago',
      },
      {
        _id: '4',
        title: '2024 Mercedes-Benz AMG GT',
        price: 135000,
        image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=400&q=80',
        viewedAt: '1 day ago',
      }
    ]);
  }, []);

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-display flex items-center gap-3">
            <FaClock className="text-gray-400 w-6 h-6" /> Recently Viewed
          </h2>
          <Link href="/buy" className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-2 transition-colors">
            Clear History <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentlyViewed.map((car) => (
            <Link key={car._id} href={`/buy/${car._id}`} className="group block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 relative overflow-hidden">
              <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                <Image src={car.image} alt={car.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5">
                  <FaClock className="w-2.5 h-2.5" /> {car.viewedAt}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{car.title}</h3>
              <p className="font-black text-primary-600 mt-1">{formatPrice(car.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
