'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SuggestedCars({ cars, currentSlug }) {
  const scrollRef = useRef(null);
  const directionRef = useRef(1);

  // Auto-scroll slowly
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || cars.length === 0) return;

    const speed = 0.5; // very slow
    const interval = setInterval(() => {
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 1) directionRef.current = -1;
      if (el.scrollLeft <= 1) directionRef.current = 1;

      el.scrollLeft += speed * directionRef.current;
    }, 30);

    return () => clearInterval(interval);
  }, [cars.length]);

  if (!cars || cars.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      <h2 className="text-xl font-bold text-white mb-6">
        Suggested for you
      </h2>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cars.map((car) => {
          const slug = car.slug || car._id?.toString();
          if (slug === currentSlug) return null;

          const priceDisplay =
            car.priceDisplay ||
            (typeof car.price === 'number'
              ? `$${car.price.toLocaleString()}`
              : 'Contact for Price');

          return (
            <Link
              key={car._id?.toString()}
              href={`/cars/${slug}`}
              className="group shrink-0 w-[280px] block"
            >
              <div className="relative aspect-[4/3] bg-white/5 overflow-hidden mb-3">
                <Image
                  src={car.thumbnail || '/placeholder-car.webp'}
                  alt={car.title}
                  fill
                  quality={100}
                  sizes="280px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-semibold text-white truncate">
                {car.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}