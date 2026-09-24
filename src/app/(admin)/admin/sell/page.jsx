'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function AdminSellPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [action, setAction] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sell');
      const data = await res.json();
      setDeals(data.deals || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this request?')) return;
    setAction({ type: 'delete', id });
    try {
      await fetch(`/api/admin/sell/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) { alert(err.message); }
    finally { setAction(null); }
  };

  const handleApprove = async (id) => {
    setAction({ type: 'approve', id });
    try {
      await fetch(`/api/admin/sell/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      await load();
    } catch (err) { alert(err.message); }
    finally { setAction(null); }
  };

  const handleContact = (deal) => {
    const message = encodeURIComponent(
      `Hello ${deal.name}, this is OB Motors regarding your ${deal.carName}.`
    );
    window.open(`https://wa.me/${deal.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const filtered = filter === 'all' ? deals : deals.filter((d) => d.status === filter);

  return (
    <div className="p-10 lg:p-12">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-3">
          Requests
        </p>
        <h1 className="text-3xl font-light text-white">Sell Requests</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-8">
        {['all', 'pending', 'approved', 'rejected'].map((s) => {
          const count = s === 'all' ? deals.length : deals.filter((d) => d.status === s).length;
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-widest rounded-md transition-colors ${
                isActive
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="border border-white/5 rounded-lg p-16 text-center">
          <p className="text-xs text-white/30 tracking-[0.4em] uppercase animate-pulse">
            Loading...
          </p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="border border-white/5 rounded-lg p-16 text-center">
          <p className="text-sm text-white/50">No sell requests</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((deal) => {
            const isDeleting = action?.type === 'delete' && action.id === deal._id;
            const isApproving = action?.type === 'approve' && action.id === deal._id;

            return (
              <div
                key={deal._id}
                className="bg-[#0E0E0F] border border-white/5 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-white/[0.02] overflow-hidden">
                  {deal.images?.[0] ? (
                    <Image
                      src={deal.images[0]}
                      alt={deal.carName}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                      No image
                    </div>
                  )}
                  {deal.status && (
                    <span
                      className={`absolute top-3 left-3 text-[9px] font-medium uppercase tracking-widest px-2.5 py-1 rounded ${
                        deal.status === 'pending'
                          ? 'bg-yellow-500 text-black'
                          : deal.status === 'approved'
                          ? 'bg-green-500 text-black'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {deal.status}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-sm font-medium text-white truncate">
                    {deal.carName}
                  </h3>
                  <p className="text-xs text-white/40 mt-1">
                    {deal.name} · {deal.phone}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    {deal.regYear && (
                      <div>
                        <p className="text-white/30 uppercase tracking-wider text-[9px]">Year</p>
                        <p className="text-white mt-0.5">{deal.regYear}</p>
                      </div>
                    )}
                    {deal.mileage && (
                      <div>
                        <p className="text-white/30 uppercase tracking-wider text-[9px]">Mileage</p>
                        <p className="text-white mt-0.5">{deal.mileage}</p>
                      </div>
                    )}
                    {deal.offeredPrice && (
                      <div className="col-span-2">
                        <p className="text-white/30 uppercase tracking-wider text-[9px]">Offered</p>
                        <p className="text-[#C9A961] mt-0.5">
                          ৳ {Number(deal.offeredPrice).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-5">
                    {deal.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(deal._id)}
                        disabled={isApproving}
                        className="flex-1 py-2.5 text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 rounded-md hover:bg-green-500/20 uppercase tracking-widest transition-colors disabled:opacity-50"
                      >
                        {isApproving ? '...' : 'Approve'}
                      </button>
                    )}
                    <button
                      onClick={() => handleContact(deal)}
                      className="flex-1 py-2.5 text-[10px] text-white/70 border border-white/10 rounded-md hover:border-white/40 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      Contact
                    </button>
                    <button
                      onClick={() => handleDelete(deal._id)}
                      disabled={isDeleting}
                      className="px-3 py-2.5 text-[10px] text-white/70 border border-white/10 rounded-md hover:border-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? '...' : '×'}
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