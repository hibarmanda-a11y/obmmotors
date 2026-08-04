'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaEye, FaClock, FaTag, FaArrowRight } from 'react-icons/fa';

/**
 * Best deals car listing component
 * Updated with Spherix Dark UI and Animations
 */
export default function BestDeals() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured cars from API (Logic untouched)
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars?featured=true&limit=6');
        const data = await response.json();
        setCars(data.cars || []);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars(getFallbackCars());
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const getFallbackCars = () => {
    return [
      {
        _id: '1',
        title: '2024 Mercedes-Benz EQS 580',
        price: 125000,
        year: 2024,
        make: 'Mercedes-Benz',
        model: 'EQS 580',
        mileage: 0,
        fuelType: 'Electric',
        images: ['https://i.ibb.co.com/ycpGzNS2/e6d455913972f456466501091edd9501.png'],
        condition: 'New',
        status: 'available',
      },
      {
        _id: '2',
        title: '2024 Porsche 911 Turbo S',
        price: 205000,
        year: 2024,
        make: 'Porsche',
        model: '911 Turbo S',
        mileage: 150,
        fuelType: 'Gasoline',
        images: ['https://i.ibb.co.com/BYmkp1g/download.webp'],
        condition: 'New',
        status: 'available',
      },
      {
        _id: '3',
        title: '2024 BMW i7 xDrive60',
        price: 145000,
        year: 2024,
        make: 'BMW',
        model: 'i7 xDrive60',
        mileage: 250,
        fuelType: 'Electric',
        images: ['https://i.ibb.co.com/WN5gpsC7/e9ed2a3ecdaac8ebd760dd571b12694c.jpg'],
        condition: 'New',
        status: 'available',
      },
    ];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // DARK THEME SKELETON LOADER
  if (loading) {
    return (
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-pulse">
            <div className="h-10 bg-white/10 rounded-full w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-white/5 rounded w-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden animate-pulse">
                <div className="h-64 bg-white/10"></div>
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Best <span className="text-[#5842f1]">Deals</span>
            </h2>
            <p className="text-lg text-gray-400">
              Discover our most popular and best-value cars. Premium quality at unbeatable prices.
            </p>
          </div>
          <Link
            href="/buy"
            className="group flex items-center space-x-3 px-8 py-4 bg-[#5842f1] hover:bg-[#4632c9] text-white rounded-2xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(88,66,241,0.3)] hover:scale-105"
          >
            <span>Explore Inventory</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car._id}
              className="group bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              <div className="relative overflow-hidden m-3 rounded-[2rem]">
                <Link href={`/buy/${car._id}`}>
                  <div className="relative h-64 w-full bg-white/5">
                    {car.images && car.images.length > 0 && (
                      <Image
                        src={car.images[0]}
                        alt={car.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    )}
                  </div>
                </Link>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {car.status === 'available' && (
                    <span className="px-4 py-1.5 bg-green-500/20 backdrop-blur-md text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                        Available
                    </span>
                    )}
                    {car.condition === 'New' && (
                    <span className="px-4 py-1.5 bg-[#5842f1]/20 backdrop-blur-md text-[#8c7dfa] text-xs font-bold rounded-full border border-[#5842f1]/30">
                        Brand New
                    </span>
                    )}
                </div>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 w-11 h-11 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-red-500 hover:bg-white/10 transition-all duration-300 group/fav">
                  <FaHeart className="w-5 h-5 transition-transform group-hover/fav:scale-110" />
                </button>
              </div>

              <div className="p-8 pt-4">
                <Link href={`/buy/${car._id}`}>
                  <h3 className="text-2xl font-bold text-white hover:text-[#5842f1] transition-colors duration-300 mb-2 truncate">
                    {car.title}
                  </h3>
                </Link>
                
                <div className="flex items-center space-x-3 text-sm text-gray-400 mb-6">
                  <span className="flex items-center gap-1"><FaClock className="w-3 h-3"/> {car.year}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span>{car.fuelType}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span>{car.mileage.toLocaleString()} mi</span>
                </div>

                <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">Price</p>
                    <span className="text-3xl font-black text-white">
                        {formatPrice(car.price)}
                    </span>
                  </div>
                  
                  <Link
                    href={`/buy/${car._id}`}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#5842f1] hover:border-[#5842f1] transition-all duration-300 group/btn"
                  >
                    <FaArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 mt-12">
            <p className="text-gray-400 text-lg">No cars found in our premium selection.</p>
          </div>
        )}
      </div>
    </section>
  );
}