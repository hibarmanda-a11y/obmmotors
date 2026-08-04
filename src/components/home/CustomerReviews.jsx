'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * Customer reviews carousel component
 */
export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: 'Michael Johnson',
      role: 'Software Engineer',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      review: 'CarVault made buying my dream car incredibly easy. The EMI options were flexible, and the entire process was smooth and transparent. Highly recommended!',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Business Owner',
      image: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      review: 'Sold my car through CarVault and got the best price. The team was professional and arranged everything quickly. Will definitely use again.',
    },
    {
      id: 3,
      name: 'David Chen',
      role: 'Doctor',
      image: 'https://i.pravatar.cc/150?img=3',
      rating: 4,
      review: 'Amazing selection of cars and great customer service. Found exactly what I was looking for with a fantastic financing package.',
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Marketing Director',
      image: 'https://i.pravatar.cc/150?img=4',
      rating: 5,
      review: 'The best car buying experience I\'ve ever had. The team went above and beyond to ensure I got the perfect car for my needs.',
    },
  ];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-600 text-sm font-bold tracking-wider uppercase mb-4 border border-primary-100">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 font-display text-gray-900 tracking-tight">
            Don't just take our word for it
          </h2>
          <p className="text-xl text-gray-500 font-medium">
            Join thousands of satisfied customers who found their perfect vehicle with our premium service.
          </p>
        </div>

        {/* Review Card */}
        <div className="max-w-4xl mx-auto relative">
          {/* Decorative Elements */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-[2.5rem] blur-3xl opacity-50"></div>
          
          <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8 md:p-14 relative z-10 overflow-hidden">
            <FaQuoteLeft className="absolute top-10 right-10 w-24 h-24 text-gray-50 opacity-50 -rotate-12" />
            
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md mb-4 border-2 border-white ring-4 ring-primary-50">
                  <Image
                    src={currentReview.image}
                    alt={currentReview.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                {/* Rating Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < currentReview.rating ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-gray-700 text-xl md:text-2xl font-medium leading-relaxed mb-8 italic">
                  "{currentReview.review}"
                </p>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 font-display">{currentReview.name}</h4>
                  <p className="text-primary-600 font-medium text-sm">{currentReview.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-10 relative z-10">
            <div className="flex space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-10 bg-primary-600' 
                      : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={prevReview}
                className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                aria-label="Previous review"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextReview}
                className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                aria-label="Next review"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}