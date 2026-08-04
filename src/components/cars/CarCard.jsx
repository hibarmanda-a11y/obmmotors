'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaArrowRight, FaGasPump, FaTachometerAlt, FaCalendar } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';

/**
 * Car card component used in the buy page and best deals grid
 */
export default function CarCard({ car }) {
  if (!car) return null;

  const { _id, title, price, year, make, model, mileage, fuelType, condition, status, images } = car;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden">
        <Link href={`/buy/${_id}`}>
          <div className="relative h-56 w-full bg-gray-100">
            {images && images.length > 0 ? (
              <Image
                src={images[0]}
                alt={title || `${year} ${make} ${model}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100">
                <span className="text-gray-400 text-4xl">🚗</span>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        {status === 'available' && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            Available
          </span>
        )}
        {condition === 'New' && (
          <span className={`absolute top-3 ${status === 'available' ? 'right-3' : 'left-3'} px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full`}>
            New
          </span>
        )}
        {status === 'sold' && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            Sold
          </span>
        )}
        {status === 'reserved' && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
            Reserved
          </span>
        )}

        {/* Favorite button */}
        <button
          className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all duration-200 shadow-sm"
          aria-label="Add to favorites"
        >
          <FaHeart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <Link href={`/buy/${_id}`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-1">
            {title || `${year} ${make} ${model}`}
          </h3>
        </Link>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4 flex-wrap">
          {year && (
            <span className="flex items-center gap-1">
              <FaCalendar className="w-3 h-3" />
              {year}
            </span>
          )}
          {fuelType && (
            <span className="flex items-center gap-1">
              <FaGasPump className="w-3 h-3" />
              {fuelType}
            </span>
          )}
          {mileage !== undefined && (
            <span className="flex items-center gap-1">
              <FaTachometerAlt className="w-3 h-3" />
              {Number(mileage).toLocaleString()} mi
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(price)}
          </span>
          <Link
            href={`/buy/${_id}`}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm group/link"
          >
            <span>View Details</span>
            <FaArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}
