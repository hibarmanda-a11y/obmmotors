'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const BRANDS = ['Mercedes-Benz', 'Rolls-Royce', 'Lexus', 'BMW', 'Audi', 'Tesla', 'Porsche', 'Ferrari', 'Land Rover', 'Toyota', 'Volvo', 'BYD'];
const BODY_STYLES = ['SUV', 'Sedan', 'Coupe'];
const FUEL_TYPES = ['PETROL', 'OCTANE', 'ELECTRIC', 'HYBRID'];
const TRANSMISSIONS = ['AUTOMATIC', 'MANUAL'];
const DRIVE_TYPES = ['AWD', 'FWD', 'RWD', '4WD'];
const CONDITIONS = ['Brand New', 'Reconditioned', 'Pre-Owned'];
const AVAILABILITY = ['Available', 'Sold'];
const PRICE_RANGES = [
  { label: 'All Price Range', min: null, max: null },
  { label: 'Under $50,000', min: 0, max: 50000 },
  { label: '$50,000 – $100,000', min: 50000, max: 100000 },
  { label: '$100,000 – $200,000', min: 100000, max: 200000 },
  { label: 'Over $200,000', min: 200000, max: null },
];

export default function CarsFilters({ variant = 'sidebar' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const current = (key) => searchParams.get(key) || '';

  const resetAll = () => {
    router.push(pathname);
    setIsOpen(false);
  };

  const FiltersContent = (
    <div className="space-y-5">
      {/* Condition */}
      <FilterSelect
        label="Condition"
        value={current('condition')}
        options={[
          { label: 'All Conditions', value: '' },
          ...CONDITIONS.map((c) => ({ label: c, value: c })),
        ]}
        onChange={(val) => updateFilter('condition', val)}
      />

      {/* Price Range */}
      <FilterSelect
        label="Price Range"
        value={current('minPrice') ? `${current('minPrice')}-${current('maxPrice')}` : ''}
        options={PRICE_RANGES.map((p) => ({
          label: p.label,
          value: p.min !== null ? `${p.min}-${p.max || ''}` : '',
        }))}
        onChange={(val) => {
          if (!val) {
            updateFilter('minPrice', '');
            updateFilter('maxPrice', '');
          } else {
            const [min, max] = val.split('-');
            const params = new URLSearchParams(searchParams.toString());
            params.set('minPrice', min);
            if (max) params.set('maxPrice', max);
            else params.delete('maxPrice');
            params.delete('page');
            router.push(`${pathname}?${params.toString()}`);
          }
        }}
      />

      {/* Brand */}
      <FilterSelect
        label="Brand"
        value={current('brand')}
        options={[{ label: 'All Brands', value: '' }, ...BRANDS.map((b) => ({ label: b, value: b }))]}
        onChange={(val) => updateFilter('brand', val)}
      />

      {/* Model */}
      <div>
        <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
          Model
        </label>
        <input
          type="text"
          placeholder="All Models"
          defaultValue={current('model')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateFilter('model', e.target.value);
              if (variant === 'drawer') setIsOpen(false);
            }
          }}
          className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/40 outline-none"
        />
      </div>

      {/* Availability */}
      <FilterSelect
        label="Availability"
        value={current('availability') || 'Available'}
        options={AVAILABILITY.map((a) => ({ label: a, value: a }))}
        onChange={(val) => updateFilter('availability', val)}
      />

      {/* Body Style */}
      <FilterSelect
        label="Body Style"
        value={current('bodyStyle')}
        options={[{ label: 'All Body Style', value: '' }, ...BODY_STYLES.map((b) => ({ label: b, value: b }))]}
        onChange={(val) => updateFilter('bodyStyle', val)}
      />

      {/* Fuel Type */}
      <FilterSelect
        label="Fuel Type"
        value={current('fuelType')}
        options={[{ label: 'All Fuel Type', value: '' }, ...FUEL_TYPES.map((f) => ({ label: f, value: f }))]}
        onChange={(val) => updateFilter('fuelType', val)}
      />

      {/* Transmission */}
      <FilterSelect
        label="Transmission"
        value={current('transmission')}
        options={[{ label: 'All Transmission', value: '' }, ...TRANSMISSIONS.map((t) => ({ label: t, value: t }))]}
        onChange={(val) => updateFilter('transmission', val)}
      />

      {/* Reset */}
      <button
        onClick={resetAll}
        className="w-full py-2.5 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );

  if (variant === 'drawer') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-white/20 bg-white/5 text-white hover:border-white/40"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" />
          </svg>
          Filters
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setIsOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-black border-r border-white/10 overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-black z-10">
                <h2 className="text-base font-bold text-white">Filter</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 text-white"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">{FiltersContent}</div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <h2 className="text-base font-bold text-white mb-4">Filter</h2>
      {FiltersContent}
    </aside>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-3 py-2 pr-8 text-sm bg-white/5 border border-white/10 text-white focus:border-white/40 outline-none cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-black text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}