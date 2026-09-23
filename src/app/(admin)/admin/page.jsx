'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cars: 0, customers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [carsRes, customersRes] = await Promise.all([
          fetch('/api/admin/cars?limit=1').then((r) => r.json()),
          fetch('/api/admin/customers?limit=1').then((r) => r.json()),
        ]);
        if (!ignore) {
          setStats({
            cars: carsRes.pagination?.total || 0,
            customers: customersRes.pagination?.total || 0,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="p-10">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-3">
          Overview
        </p>
        <h1 className="text-3xl font-extralight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/cars"
          className="border border-white/10 bg-black p-8 hover:border-white/30 transition-colors group"
        >
          <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">
            Total Cars
          </p>
          <p className="text-5xl font-extralight text-white">
            {loading ? '—' : stats.cars}
          </p>
          <p className="text-xs text-white/40 mt-4 tracking-wider">
            Manage inventory →
          </p>
        </Link>

        <Link
          href="/admin/customers"
          className="border border-white/10 bg-black p-8 hover:border-white/30 transition-colors group"
        >
          <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">
            Happy Customers
          </p>
          <p className="text-5xl font-extralight text-white">
            {loading ? '—' : stats.customers}
          </p>
          <p className="text-xs text-white/40 mt-4 tracking-wider">
            Manage gallery →
          </p>
        </Link>
      </div>
    </div>
  );
}