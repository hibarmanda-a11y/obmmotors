'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { label: 'Pre-Owned', value: 'Pre-Owned', subtitle: 'Previously owned, well maintained' },
  { label: 'Brand New', value: 'Brand New', subtitle: 'Fresh imports, 0 KM' },
  { label: 'Reconditioned', value: 'Reconditioned', subtitle: 'Restored to perfection' },
];

export default function WhatYouLookingFor() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        // ✅ Fetch condition-specific cars
        const catResults = await Promise.all(
          CATEGORIES.map((cat) =>
            fetch(`/api/cars?condition=${encodeURIComponent(cat.value)}&limit=1`)
              .then((r) => r.json())
              .then((d) => ({ ...cat, car: d.cars?.[0] || null }))
              .catch(() => ({ ...cat, car: null }))
          )
        );

        // ✅ Fallback: jodi kono category te car na thake, onno car theke image niye
        const missing = catResults.filter((c) => !c.car);
        let fallbackCars = [];

        if (missing.length > 0) {
          const fallbackRes = await fetch(`/api/cars?limit=${missing.length + 3}`);
          const fallbackData = await fallbackRes.json();
          fallbackCars = fallbackData.cars || [];
        }

        // ✅ Assign fallback
        let fallbackIdx = 0;
        const merged = catResults.map((cat) => {
          if (cat.car) return cat;
          const fb = fallbackCars[fallbackIdx++];
          return { ...cat, car: fb || null };
        });

        if (!cancelled) setCategories(merged);
      } catch (err) {
        console.error('WhatYouLookingFor error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-black py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            What You Looking For
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Browse by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, index) => {
            const data = categories[index];
            const car = data?.car;
            const thumbnail = car?.thumbnail;

            return (
              <Link
                key={cat.value}
                href={`/cars?condition=${encodeURIComponent(cat.value)}`}
                className="group block relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[4/5] overflow-hidden bg-white/5"
              >
                {loading ? (
                  <div className="absolute inset-0 bg-white/5 animate-pulse" />
                ) : thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={cat.label}
                    fill
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/5" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Text */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {cat.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}