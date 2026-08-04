'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaTimes, FaCar, FaArrowRight } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';

export default function Wishlist() {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  
  // Mock wishlist data for UI demonstration
  useEffect(() => {
    // In a real app, this would fetch from localStorage or API
    setWishlist([
      {
        _id: '1',
        title: '2024 BMW M4 Competition',
        price: 89900,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80',
      },
      {
        _id: '2',
        title: '2023 Porsche 911 Carrera',
        price: 114500,
        image: 'https://images.unsplash.com/photo-1503376712394-6d9b0d4b8e0b?auto=format&fit=crop&w=400&q=80',
      }
    ]);
  }, []);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item._id !== id));
  };

  return (
    <div className="relative z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group"
        title="Wishlist"
      >
        <FaHeart className="w-4 h-4 group-hover:scale-110 transition-transform" />
        {wishlist.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#060714]">
            {wishlist.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm sm:hidden" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 top-full mt-4 w-[340px] bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 font-display flex items-center gap-2">
                <FaHeart className="text-red-500" /> My Wishlist
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {wishlist.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <FaHeart className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-gray-900 font-bold mb-1">Your wishlist is empty</p>
                  <p className="text-sm text-gray-500">Save cars you love here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {wishlist.map(item => (
                    <div key={item._id} className="p-4 flex gap-3 hover:bg-gray-50/50 transition-colors group relative">
                      <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                          <Link href={`/buy/${item._id}`} onClick={() => setIsOpen(false)} className="after:absolute after:inset-0">
                            {item.title}
                          </Link>
                        </p>
                        <p className="text-sm font-black text-primary-600">{formatPrice(item.price)}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromWishlist(item._id); }}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all relative z-10"
                      >
                        <FaTimes className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Link 
                  href="/buy" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-sm hover:shadow-primary-600/30"
                >
                  View All Saved Cars <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
