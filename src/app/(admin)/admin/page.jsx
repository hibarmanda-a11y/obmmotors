'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    cars: 0,
    sellRequests: 0,
    appointments: 0,
    pending: 0,
  });
  const [recentSell, setRecentSell] = useState([]);
  const [recentAppts, setRecentAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [carsRes, sellRes, apptRes] = await Promise.all([
          fetch('/api/admin/cars?limit=1').then((r) => r.json()),
          fetch('/api/admin/sell').then((r) => r.json()),
          fetch('/api/admin/appointments').then((r) => r.json()),
        ]);
        if (ignore) return;

        const appts = apptRes.appointments || [];
        setStats({
          cars: carsRes.pagination?.total || 0,
          sellRequests: (sellRes.deals || []).length,
          appointments: appts.length,
          pending: appts.filter((a) => a.status === 'pending').length,
        });
        setRecentSell((sellRes.deals || []).slice(0, 5));
        setRecentAppts(appts.slice(0, 5));
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
    <div className="p-10 lg:p-12">
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-3">
          Overview
        </p>
        <h1 className="text-3xl font-light text-white">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatCard label="Total Cars" value={loading ? '—' : stats.cars} href="/admin/cars" />
        <StatCard label="Sell Requests" value={loading ? '—' : stats.sellRequests} href="/admin/sell" />
        <StatCard label="Appointments" value={loading ? '—' : stats.appointments} href="/admin/appointments" />
        <StatCard
          label="Pending"
          value={loading ? '—' : stats.pending}
          href="/admin/appointments"
          highlight
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard title="Recent Sell Requests" href="/admin/sell">
          {loading ? (
            <Loading />
          ) : recentSell.length === 0 ? (
            <Empty text="No sell requests yet" />
          ) : (
            <div className="space-y-4">
              {recentSell.map((d) => (
                <div key={d._id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{d.carName}</p>
                    <p className="text-xs text-white/40 mt-1">{d.name} · {d.phone}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          )}
        </ActivityCard>

        <ActivityCard title="Recent Appointments" href="/admin/appointments">
          {loading ? (
            <Loading />
          ) : recentAppts.length === 0 ? (
            <Empty text="No appointments yet" />
          ) : (
            <div className="space-y-4">
              {recentAppts.map((a) => (
                <div key={a._id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{a.name}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {a.date} · {a.time}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </ActivityCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, href, highlight }) {
  return (
    <Link
      href={href}
      className={`group block bg-[#0E0E0F] border rounded-lg p-6 transition-all ${
        highlight
          ? 'border-yellow-500/30 hover:border-yellow-500/60'
          : 'border-white/5 hover:border-white/20'
      }`}
    >
      <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">
        {label}
      </p>
      <p
        className={`text-4xl font-light ${
          highlight ? 'text-yellow-400' : 'text-white'
        }`}
      >
        {value}
      </p>
    </Link>
  );
}

function ActivityCard({ title, href, children }) {
  return (
    <div className="bg-[#0E0E0F] border border-white/5 rounded-lg">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <h2 className="text-[11px] tracking-[0.3em] text-white/60 uppercase">
          {title}
        </h2>
        <Link
          href={href}
          className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest"
        >
          View All →
        </Link>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'text-yellow-400',
    approved: 'text-green-400',
    confirmed: 'text-green-400',
    completed: 'text-blue-400',
    cancelled: 'text-red-400',
    rejected: 'text-red-400',
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest font-medium ${styles[status] || 'text-white/40'}`}>
      {status || 'pending'}
    </span>
  );
}

function Loading() {
  return (
    <p className="text-xs text-white/30 text-center py-8 tracking-widest uppercase animate-pulse">
      Loading...
    </p>
  );
}

function Empty({ text }) {
  return <p className="text-xs text-white/30 text-center py-8">{text}</p>;
}