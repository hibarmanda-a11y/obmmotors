'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function CarsToolbar({ currentSearch = '', compact = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      return;
    }

    let active = true;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cars?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        if (active) {
          setSuggestions(data.cars || []);
          setOpen(true);
        }
      } catch {
        if (active) setSuggestions([]);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set('search', value.trim());
    else params.delete('search');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className={`w-full ${compact ? '' : 'mb-5'}`}>
      <div ref={wrapperRef} className="relative w-full">
        <form onSubmit={(e) => { e.preventDefault(); submit(query); }}>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                if (!value.trim() || value.length < 2) {
                  setSuggestions([]);
                  setOpen(false);
                }
              }}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              placeholder="Search cars, brands, models..."
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/40 outline-none"
            />
          </div>
        </form>

        {open && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-black border border-white/10 max-h-96 overflow-y-auto">
            {suggestions.map((car) => {
              const c = {
                id: car._id?.toString() || '',
                slug: car.slug || car._id?.toString() || '',
                title: car.title || 'Untitled',
                brand: car.specs?.brand || 'Unknown',
                priceDisplay: car.priceDisplay || (typeof car.price === 'number' ? `$${car.price.toLocaleString()}` : 'Contact for Price'),
                thumbnail: car.thumbnail || '/placeholder-car.webp',
              };
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { router.push(`${pathname}/${c.slug}`); setOpen(false); }}
                  className="w-full flex items-center gap-3 p-2 hover:bg-white/5 text-left"
                >
                  <div className="relative w-14 h-10 bg-white/5 shrink-0">
                    <Image src={c.thumbnail} alt={c.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50 uppercase tracking-wide">{c.brand}</p>
                    <p className="text-sm text-white truncate">{c.title}</p>
                  </div>
                  <span className="text-xs font-semibold text-white/80 whitespace-nowrap">
                    {c.priceDisplay}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => submit(query)}
              className="w-full p-2 text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border-t border-white/10"
            >
              See all results for &quot;{query}&quot;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}