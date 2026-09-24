'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cars?limit=100');
      const data = await res.json();
      setCars(data.cars || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    } catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  return (
    <div className="p-10 lg:p-12">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-3">
            Inventory
          </p>
          <h1 className="text-3xl font-light text-white">Cars</h1>
        </div>
        <Link
          href="/admin/cars/new"
          className="px-6 py-3 bg-white text-black text-xs font-medium uppercase tracking-[0.2em] rounded-md hover:bg-white/90 transition-colors"
        >
          + Add Car
        </Link>
      </div>

      {loading && (
        <div className="border border-white/5 rounded-lg p-16 text-center">
          <p className="text-xs text-white/30 tracking-[0.4em] uppercase animate-pulse">
            Loading...
          </p>
        </div>
      )}

      {!loading && cars.length === 0 && (
        <div className="border border-white/5 rounded-lg p-16 text-center">
          <p className="text-sm text-white/50">No cars yet</p>
        </div>
      )}

      {!loading && cars.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cars.map((car) => {
            const isDeleting = deleting === car._id;
            return (
              <div
                key={car._id}
                className="bg-[#0E0E0F] border border-white/5 rounded-lg overflow-hidden hover:border-white/20 transition-colors group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-white/[0.02] overflow-hidden">
                  {car.thumbnail && (
                    <Image
                      src={car.thumbnail}
                      alt={car.title}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  )}
                  {car.isFeatured && (
                    <span className="absolute top-3 left-3 bg-white text-black text-[9px] font-medium uppercase tracking-widest px-2.5 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1.5">
                    {car.specs?.brand}
                  </p>
                  <h3 className="text-sm font-medium text-white truncate">
                    {car.title}
                  </h3>
                  <p className="text-sm text-[#C9A961] mt-2">
                    {car.priceDisplay}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-5">
                    <Link
                      href={`/admin/cars/${car._id}`}
                      className="flex-1 text-center py-2.5 text-[10px] text-white/70 border border-white/10 rounded-md hover:border-white/40 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(car._id, car.title)}
                      disabled={isDeleting}
                      className="flex-1 py-2.5 text-[10px] text-white/70 border border-white/10 rounded-md hover:border-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}