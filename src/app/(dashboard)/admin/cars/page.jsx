'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaCar, FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

/**
 * Admin Cars management page — list, add, edit, delete car listings
 */
export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    title: '', make: '', model: '', year: new Date().getFullYear(),
    price: '', mileage: '', fuelType: 'Gasoline', condition: 'New',
    status: 'available', description: '', images: [],
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars?limit=50');
      const data = await res.json();
      setCars(data.cars || []);
    } catch {
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Car deleted');
        fetchCars();
      } else {
        toast.error('Failed to delete car');
      }
    } catch {
      toast.error('Failed to delete car');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCar ? `/api/cars/${editingCar._id}` : '/api/cars';
    const method = editingCar ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price), year: Number(formData.year), mileage: Number(formData.mileage) }),
      });
      if (res.ok) {
        toast.success(editingCar ? 'Car updated' : 'Car added');
        setShowForm(false);
        setEditingCar(null);
        fetchCars();
      } else {
        toast.error('Failed to save car');
      }
    } catch {
      toast.error('Failed to save car');
    }
  };

  const openEdit = (car) => {
    setEditingCar(car);
    setFormData({
      title: car.title || '',
      make: car.make || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      price: car.price || '',
      mileage: car.mileage || '',
      fuelType: car.fuelType || 'Gasoline',
      condition: car.condition || 'New',
      status: car.status || 'available',
      description: car.description || '',
      images: car.images || [],
    });
    setShowForm(true);
  };

  const filtered = cars.filter((c) =>
    [c.title, c.make, c.model].some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm';
  const selectClass = `${inputClass} bg-white`;

  return (
    <div className="min-h-screen bg-surface py-12 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">Manage <span className="text-primary-600">Inventory</span></h1>
            <p className="text-gray-500 mt-2 font-medium">{cars.length} vehicles currently listed</p>
          </div>
          <button
            onClick={() => { setEditingCar(null); setFormData({ title:'',make:'',model:'',year:new Date().getFullYear(),price:'',mileage:'',fuelType:'Gasoline',condition:'New',status:'available',description:'',images:[] }); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-600/30 active:scale-95"
          >
            <FaPlus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search inventory by make, model, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white shadow-soft border border-gray-100 rounded-[1.5rem] focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium text-gray-900"
          />
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-[2rem] shadow-float border border-gray-100 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative z-10 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold font-display text-gray-900">{editingCar ? 'Edit Vehicle Details' : 'Add New Vehicle'}</h2>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Listing Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className={inputClass} placeholder="e.g., 2024 BMW 5 Series M Sport" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Price ($)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required min="0" className={inputClass} placeholder="e.g., 75000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Make</label>
                <input type="text" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} required className={inputClass} placeholder="e.g., BMW" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Model</label>
                <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required className={inputClass} placeholder="e.g., 5 Series" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Year</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required min="1900" max={new Date().getFullYear()} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Mileage (mi)</label>
                <input type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} min="0" className={inputClass} placeholder="e.g., 12000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Fuel Type</label>
                <select value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })} className={selectClass}>
                  {['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'].map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Condition</label>
                <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className={selectClass}>
                  {['New', 'Used', 'Certified Pre-Owned'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={selectClass}>
                  {['available', 'sold', 'reserved'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Primary Image URL (optional)</label>
                <input type="url" placeholder="https://..." onChange={(e) => setFormData({ ...formData, images: e.target.value ? [e.target.value] : [] })} className={inputClass} />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Detailed Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className={inputClass} placeholder="Describe the vehicle's features, packages, condition..." />
              </div>
              <div className="lg:col-span-3 flex gap-4 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-600/30">
                  <FaCheck className="w-5 h-5" />
                  {editingCar ? 'Save Changes' : 'Publish Vehicle'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cars Table */}
        <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
               <p className="text-gray-500 font-medium">Loading inventory...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FaCar className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">No vehicles found</h3>
              <p className="text-gray-500 max-w-sm">We couldn't find any vehicles matching your current search criteria or the inventory is empty.</p>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="mt-6 px-6 py-2 bg-primary-50 text-primary-600 font-bold rounded-full hover:bg-primary-100 transition-colors">
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Vehicle Details', 'Price', 'Year', 'Fuel', 'Condition', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((car) => (
                    <tr key={car._id} className="hover:bg-primary-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-200">
                            {car.images?.[0] ? (
                              <Image src={car.images[0]} alt={car.title} width={64} height={48} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FaCar className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{car.title || `${car.year} ${car.make} ${car.model}`}</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">{car.make} {car.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-primary-600 text-sm">{formatPrice(car.price)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{car.year}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{car.fuelType}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{car.condition}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          car.status === 'available' ? 'bg-green-100 text-green-700 border border-green-200' :
                          car.status === 'sold' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(car)} className="w-10 h-10 flex items-center justify-center text-primary-600 bg-primary-50 hover:bg-primary-600 hover:text-white rounded-xl transition-all shadow-sm" title="Edit">
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(car._id)} className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm" title="Delete">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
