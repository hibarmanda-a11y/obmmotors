'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(null);

  const loadCars = useCallback(async () => {
    const res = await fetch('/api/admin/cars?limit=100');
    if (!res.ok) throw new Error('Failed to load cars');
    return res.json();
  }, []);

  useEffect(() => {
    loadCars()
      .then((data) => setCars(data.cars || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [loadCars]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setAction({ type: 'delete', id });
    try {
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      const data = await loadCars();
      setCars(data.cars || []);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setAction(null);
    }
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-2">
            Inventory
          </p>
          <h1 className="text-2xl font-extralight">Cars</h1>
        </div>
        <Link
          href="/admin/cars/new"
          className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.3em] hover:bg-white/90 transition-colors"
        >
          + Add Car
        </Link>
      </div>

      {loading && (
        <div className="border border-white/10 p-12 text-center">
          <p className="text-xs text-white/40 tracking-[0.4em] uppercase animate-pulse">
            [ .... please wait loading .... ]
          </p>
        </div>
      )}

      {!loading && cars.length === 0 && (
        <div className="border border-white/10 p-12 text-center">
          <p className="text-sm text-white/60">No cars yet.</p>
        </div>
      )}

      {!loading && cars.length > 0 && (
        <div className="border border-white/10 divide-y divide-white/5">
          {cars.map((car) => {
            const isDeleting = action?.type === 'delete' && action.id === car._id;
            return (
              <div key={car._id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                <div className="relative w-24 h-16 shrink-0 bg-white/5 overflow-hidden">
                  {car.thumbnail && (
                    <Image src={car.thumbnail} alt={car.title} fill sizes="96px" className="object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{car.title}</p>
                  <p className="text-xs text-white/40 truncate mt-1">
                    {car.specs?.brand} · {car.specs?.reg_year} · {car.slug}
                  </p>
                </div>

                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-sm text-white/80 font-light">{car.priceDisplay || '—'}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{car.status}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/cars/${car._id}`}
                    className="px-4 py-2 text-xs text-white/70 border border-white/10 hover:border-white/40 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(car._id, car.title)}
                    disabled={isDeleting}
                    className="px-4 py-2 text-xs text-white/70 border border-white/10 hover:border-red-500 hover:text-red-400 uppercase tracking-widest transition-colors disabled:opacity-50 min-w-[80px]"
                  >
                    {isDeleting ? <span className="animate-pulse">[ .. ]</span> : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}