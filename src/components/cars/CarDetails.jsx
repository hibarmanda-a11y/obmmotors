'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  FaGasPump,
  FaTachometerAlt,
  FaCalendar,
  FaCog,
  FaPalette,
  FaChair,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaCheckCircle,
  FaCar,
} from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';

/**
 * Car detail view component — shows full info about a single car
 * @param {object} car - Car data object from MongoDB
 */
export default function CarDetails({ car }) {
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaCar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">Car not found</h2>
          <Link
            href="/buy"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const {
    _id,
    title,
    price,
    year,
    make,
    model,
    mileage,
    fuelType,
    condition,
    status,
    images = [],
    description,
    transmission,
    color,
    seats,
    features = [],
  } = car;

  const specs = [
    { icon: FaCalendar, label: 'Year', value: year },
    { icon: FaGasPump, label: 'Fuel Type', value: fuelType },
    { icon: FaTachometerAlt, label: 'Mileage', value: mileage ? `${Number(mileage).toLocaleString()} mi` : 'N/A' },
    { icon: FaCog, label: 'Transmission', value: transmission || 'Automatic' },
    { icon: FaPalette, label: 'Color', value: color || 'N/A' },
    { icon: FaChair, label: 'Seats', value: seats || 'N/A' },
  ];

  const statusConfig = {
    available: { label: 'Available', className: 'bg-green-100 text-green-700' },
    sold: { label: 'Sold', className: 'bg-red-100 text-red-700' },
    reserved: { label: 'Reserved', className: 'bg-yellow-100 text-yellow-700' },
  };

  const currentStatus = statusConfig[status] || statusConfig.available;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back link */}
        <Link
          href="/buy"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to listings
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            {/* Main image */}
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-200 shadow-lg">
              {images.length > 0 ? (
                <Image
                  src={images[activeImage]}
                  alt={title || `${year} ${make} ${model}`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaCar className="w-24 h-24 text-gray-300" />
                </div>
              )}
              {/* Status badge */}
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${currentStatus.className}`}>
                {currentStatus.label}
              </span>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === i ? 'border-blue-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                {condition && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2 inline-block">
                    {condition}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900">
                  {title || `${year} ${make} ${model}`}
                </h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <FaHeart className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-blue-600 transition-all duration-200">
                  <FaShare className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-4xl font-bold text-blue-600 mb-6">
              {formatPrice(price)}
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Icon className="w-4 h-4 text-blue-500" />
                    {label}
                  </div>
                  <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {status === 'available' && (
              <Link
                href={`/buy/${_id}#purchase`}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99]"
              >
                <FaCar className="w-5 h-5" />
                Buy Now
              </Link>
            )}
            {status !== 'available' && (
              <div className="w-full text-center py-4 bg-gray-100 text-gray-500 rounded-2xl font-semibold">
                {currentStatus.label} — Not available for purchase
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
