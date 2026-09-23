'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ROTATION_INTERVAL = 2000;
const FETCH_LIMIT = 12;

export default function CarInventory() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCars() {
      try {
        const res = await fetch(`/api/cars?limit=${FETCH_LIMIT}&sort=newest`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) setCars(data.cars || []);
      } catch (err) {
        console.error('CarInventory fetch error:', err);
        if (!cancelled) setCars([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCars();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (cars.length <= 1) return;
    const t = setInterval(() => {
      setRotationIndex((i) => (i + 1) % cars.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(t);
  }, [cars.length]);

  const getCarAt = useCallback(
    (offset) => {
      if (cars.length === 0) return null;
      return cars[(rotationIndex + offset) % cars.length];
    },
    [cars, rotationIndex]
  );

  if (loading) {
    return (
      <section className="bg-black py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Current Inventory
            </h2>
            <Link href="/cars" className="text-sm font-semibold text-white/80 hover:text-white">
              See All
            </Link>
          </div>

          <div className="md:hidden">
            <div className="aspect-[4/5] bg-white/5 animate-pulse" />
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section className="bg-black py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Current Inventory
            </h2>
            <Link href="/cars" className="text-sm font-semibold text-white/80 hover:text-white">
              See All
            </Link>
          </div>
          <p className="text-white/50 text-sm">No cars available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Current Inventory
          </h2>
          <Link href="/cars" className="text-sm font-semibold text-white/80 hover:text-white">
            See All
          </Link>
        </div>

        {/* Mobile: 1 photo */}
        <div className="md:hidden">
          <SlideCard car={getCarAt(0)} />
        </div>

        {/* Desktop: 4 photos, same row, taller card */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SlideCard car={getCarAt(0)} />
          <SlideCard car={getCarAt(1)} />
          <SlideCard car={getCarAt(2)} />
          <SlideCard car={getCarAt(3)} />
        </div>
      </div>
    </section>
  );
}

function SlideCard({ car }) {
  if (!car) return null;

  const slug = car.slug || car._id?.toString() || '';
  const thumbnail = car.thumbnail || '/placeholder-car.webp';
  const title = car.title || 'Untitled';

  return (
    <Link href={`/cars/${slug}`} className="group block">
      {/* ✅ Image — taller (4:5), no overlay */}
      <div className="relative aspect-[4/5] bg-white/5 overflow-hidden">
        <Image
          key={thumbnail}
          src={thumbnail}
          alt={title}
          fill
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* ✅ Title below the image only */}
      <div className="pt-3">
        <p className="text-sm sm:text-base font-semibold text-white line-clamp-1 group-hover:text-white/80 transition-colors">
          {title}
        </p>
      </div>
    </Link>
  );
}