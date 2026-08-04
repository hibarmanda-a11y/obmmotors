'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBalanceScale, FaTimes, FaArrowRight } from 'react-icons/fa';

export default function CompareBar() {
  const [compareList, setCompareList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this reads from state/localStorage
    setCompareList([
      {
        _id: '1',
        title: '2024 BMW M4',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=150&q=80',
      },
      {
        _id: '2',
        title: '2023 Porsche 911',
        image: 'https://images.unsplash.com/photo-1503376712394-6d9b0d4b8e0b?auto=format&fit=crop&w=150&q=80',
      }
    ]);
    
    // Simulate showing the bar after a delay for the demo
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
      <div className="container mx-auto max-w-4xl flex justify-center">
        <div className="bg-white shadow-2xl shadow-primary-900/20 rounded-[2rem] border border-gray-100 p-4 pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-500 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-3 pr-4 sm:border-r border-gray-100">
             <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
               <FaBalanceScale className="w-5 h-5" />
             </div>
             <div>
               <p className="text-sm font-bold text-gray-900 font-display leading-tight">Compare Cars</p>
               <p className="text-xs text-gray-500">{compareList.length} / 3 selected</p>
             </div>
          </div>

          <div className="flex gap-4 flex-1 justify-center sm:justify-start">
            {compareList.map((car, index) => (
              <div key={car._id} className="relative group">
                <div className="w-16 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm relative">
                  <Image src={car.image} alt={car.title} fill className="object-cover" />
                </div>
                <button 
                  onClick={() => setCompareList(prev => prev.filter(c => c._id !== car._id))}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                >
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="w-16 h-12 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
                +
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => setIsVisible(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600 px-2 py-2">
               Hide
             </button>
             <Link href="/compare" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-primary-600/30">
               Compare <FaArrowRight className="w-3 h-3" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
