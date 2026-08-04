'use client';

import { useState, useEffect } from 'react';
import { FaClipboardList, FaSearch, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

/**
 * Admin Sell Requests page — review and manage user sell submissions
 */
export default function AdminSellRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/api/sell?status=${statusFilter}` : '/api/sell';
      const res = await fetch(url);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      toast.error('Failed to load sell requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [statusFilter]);

  const filtered = requests.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.authorName?.toLowerCase().includes(term) ||
      r.authorEmail?.toLowerCase().includes(term) ||
      r.carMake?.toLowerCase().includes(term) ||
      r.carModel?.toLowerCase().includes(term)
    );
  });

  const statusConfig = {
    pending: { label: 'Pending', icon: FaClock, className: 'bg-yellow-100 text-yellow-700' },
    approved: { label: 'Approved', icon: FaCheck, className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', icon: FaTimes, className: 'bg-red-100 text-red-700' },
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-surface py-12 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
              Sell <span className="text-primary-600">Requests</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Review and appraise user vehicle submissions</p>
          </div>
          <div className="flex items-center space-x-3">
             <span className="px-5 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-bold shadow-sm border border-yellow-200">
              {counts.pending} Action Required
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { key: '', label: 'All Submissions', count: counts.all },
            { key: 'pending', label: 'Pending Review', count: counts.pending },
            { key: 'approved', label: 'Approved', count: counts.approved },
            { key: 'rejected', label: 'Rejected', count: counts.rejected },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                statusFilter === key
                  ? 'bg-primary-600 text-white shadow-primary-600/30'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {label} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${statusFilter === key ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer name, email, make, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white shadow-soft border border-gray-100 rounded-[1.5rem] focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium text-gray-900"
          />
        </div>

        {/* Cards */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center bg-white rounded-[2rem] shadow-soft border border-gray-100">
             <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
             <p className="text-gray-500 font-medium">Loading submissions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] shadow-soft border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FaClipboardList className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">No requests found</h3>
            <p className="text-gray-500 max-w-sm">No sell requests match your current filters.</p>
            {(searchTerm || statusFilter) && (
              <button onClick={() => { setSearchTerm(''); setStatusFilter(''); }} className="mt-6 px-6 py-2 bg-primary-50 text-primary-600 font-bold rounded-full hover:bg-primary-100 transition-colors">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((req) => {
              const status = statusConfig[req.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={req._id} className="bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8 hover:shadow-float transition-shadow duration-300 relative overflow-hidden group">
                  <div className="flex items-start justify-between gap-6 flex-wrap relative z-10">
                    <div className="flex-1 w-full lg:w-auto">
                      <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                          <FaClipboardList className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-display group-hover:text-primary-600 transition-colors">
                            {req.carYear} {req.carMake} {req.carModel}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">Submitted by <span className="font-bold text-gray-700">{req.authorName}</span> on {formatDate(req.createdAt)}</p>
                        </div>
                        <span className={`ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${status.className} ${req.status === 'pending' ? 'border-yellow-200' : req.status === 'approved' ? 'border-green-200' : 'border-red-200'}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Details</p>
                          <p className="font-bold text-gray-900 truncate">{req.authorEmail}</p>
                          <p className="text-gray-500 truncate mt-1">{req.authorPhone}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                          <p className="font-bold text-gray-900">{req.city}</p>
                          <p className="text-gray-500 mt-1">{req.state}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Condition & Mileage</p>
                          <p className="font-bold text-gray-900">{req.carCondition}</p>
                          <p className="text-gray-500 mt-1">{Number(req.carMileage || 0).toLocaleString()} mi</p>
                        </div>
                        <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100">
                          <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Asking Price</p>
                          <p className="text-2xl font-black text-primary-600">${Number(req.askingPrice || 0).toLocaleString()}</p>
                        </div>
                      </div>

                      {req.carDescription && (
                        <div className="mt-6">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Seller Notes</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">"{req.carDescription}"</p>
                        </div>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex lg:flex-col gap-3 flex-shrink-0 w-full lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-green-500/30">
                          <FaCheck className="w-4 h-4" />
                          Approve
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-red-50 text-red-500 border border-red-200 hover:border-red-300 rounded-xl text-sm font-bold transition-all">
                          <FaTimes className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
