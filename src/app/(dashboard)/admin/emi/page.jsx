'use client';

import { useState, useEffect } from 'react';
import { FaDollarSign, FaSearch, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

/**
 * Admin EMI management page — view all active EMI plans
 */
export default function AdminEMIPage() {
  const [emis, setEmis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEMIs = async () => {
      try {
        const res = await fetch('/api/emi');
        const data = await res.json();
        setEmis(data.emi || []);
      } catch {
        toast.error('Failed to load EMI records');
      } finally {
        setLoading(false);
      }
    };
    fetchEMIs();
  }, []);

  const statusConfig = {
    active: { label: 'Active', icon: FaClock, className: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completed', icon: FaCheckCircle, className: 'bg-green-100 text-green-700' },
    defaulted: { label: 'Defaulted', icon: FaExclamationCircle, className: 'bg-red-100 text-red-700' },
  };

  const filtered = emis.filter((emi) => {
    const term = searchTerm.toLowerCase();
    return (
      emi.userId?.email?.toLowerCase().includes(term) ||
      emi.userId?.name?.toLowerCase().includes(term) ||
      emi.carId?.title?.toLowerCase().includes(term) ||
      emi.userId?.toLowerCase?.().includes(term)
    );
  });

  const totalOutstanding = filtered
    .filter((e) => e.status === 'active')
    .reduce((sum, e) => sum + (e.remainingBalance || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            EMI <span className="text-blue-600">Management</span>
          </h1>
          <p className="text-gray-500 mt-1">
            {filtered.filter((e) => e.status === 'active').length} active plans ·{' '}
            <span className="text-blue-600 font-semibold">{formatPrice(totalOutstanding)}</span> outstanding
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by user or car..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading EMI records...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FaDollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No EMI records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['User', 'Car', 'Loan Amount', 'Monthly', 'Remaining', 'Next Due', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((emi) => {
                    const status = statusConfig[emi.status] || statusConfig.active;
                    const StatusIcon = status.icon;
                    return (
                      <tr key={emi._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-sm text-gray-900">
                            {emi.userId?.name || emi.userId || '—'}
                          </p>
                          <p className="text-xs text-gray-400">{emi.userId?.email || ''}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {emi.carId?.title || emi.carId || '—'}
                        </td>
                        <td className="px-4 py-3 font-semibold text-sm">{formatPrice(emi.loanAmount)}</td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-semibold">{formatPrice(emi.monthlyPayment)}/mo</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatPrice(emi.remainingBalance)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {emi.nextPaymentDue ? formatDate(emi.nextPaymentDue) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
