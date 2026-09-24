'use client';

import { useState, useEffect, useCallback } from 'react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [action, setAction] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id, status) => {
    setAction({ type: status, id });
    try {
      await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (err) { alert(err.message); }
    finally { setAction(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    setAction({ type: 'delete', id });
    try {
      await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) { alert(err.message); }
    finally { setAction(null); }
  };

  const filtered =
    filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="p-10 lg:p-12">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-3">
          Schedule
        </p>
        <h1 className="text-3xl font-light text-white">Appointments</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => {
          const count =
            s === 'all' ? appointments.length : appointments.filter((a) => a.status === s).length;
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-widest rounded-md transition-colors whitespace-nowrap ${
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
          <p className="text-sm text-white/50">No appointments</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-[#0E0E0F] border border-white/5 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40">
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Date & Time</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filtered.map((a) => {
            const isAction = (type) => action?.type === type && action.id === a._id;
            return (
              <div
                key={a._id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
              >
                <div className="lg:col-span-3">
                  <p className="text-sm text-white">{a.name}</p>
                  {a.note && (
                    <p className="text-xs text-white/40 truncate mt-1">{a.note}</p>
                  )}
                </div>

                <div className="lg:col-span-3">
                  <p className="text-xs text-white/70">{a.email}</p>
                  <p className="text-xs text-white/40 mt-1">{a.phone}</p>
                </div>

                <div className="lg:col-span-2">
                  <p className="text-sm text-white">{a.date}</p>
                  <p className="text-xs text-[#C9A961] mt-1">{a.time}</p>
                </div>

                <div className="lg:col-span-2">
                  <StatusBadge status={a.status} />
                </div>

                <div className="lg:col-span-2 flex items-center justify-end gap-2">
                  {a.status !== 'confirmed' && a.status !== 'completed' && (
                    <button
                      onClick={() => handleStatus(a._id, 'confirmed')}
                      disabled={isAction('confirmed')}
                      className="px-3 py-2 text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 rounded-md hover:bg-green-500/20 uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      {isAction('confirmed') ? '...' : 'Confirm'}
                    </button>
                  )}
                  {a.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatus(a._id, 'completed')}
                      disabled={isAction('completed')}
                      className="px-3 py-2 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-md hover:bg-blue-500/20 uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      {isAction('completed') ? '...' : 'Finish'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(a._id)}
                    disabled={isAction('delete')}
                    className="px-3 py-2 text-[10px] text-white/50 border border-white/10 rounded-md hover:border-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    {isAction('delete') ? '...' : '×'}
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

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/10 text-green-400 border-green-500/30',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  const cls = styles[status] || styles.pending;
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest border rounded ${cls}`}
    >
      {status || 'pending'}
    </span>
  );
}