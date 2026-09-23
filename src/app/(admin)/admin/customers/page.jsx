'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState({ ownerName: '', model: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers?limit=100');
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/admin/customers?limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCustomers(data.customers || []);
      })
      .catch((err) => {
        if (!cancelled) console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !form.ownerName || !form.model) {
      alert('All fields required');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', selectedFile);
      formData.append('folder', 'customers');
      formData.append('slug', form.ownerName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      const createRes = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadData.urls[0],
          ownerName: form.ownerName,
          model: form.model,
        }),
      });
      if (!createRes.ok) throw new Error('Failed to save');

      setForm({ ownerName: '', model: '' });
      setSelectedFile(null);
      e.target.reset();
      await loadCustomers();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await loadCustomers();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-10">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-2">
          Gallery
        </p>
        <h1 className="text-2xl font-extralight">Happy Customers</h1>
      </div>

      <form onSubmit={handleUpload} className="border border-white/10 p-6 mb-8">
        <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-6">
          Add New Customer
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Owner Name"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            className="px-4 py-3 text-sm bg-transparent border border-white/10 text-white focus:border-white/40 outline-none"
          />
          <input
            type="text"
            placeholder="Car Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="px-4 py-3 text-sm bg-transparent border border-white/10 text-white focus:border-white/40 outline-none"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="px-4 py-3 text-sm bg-transparent border border-white/10 text-white focus:border-white/40 outline-none file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-white/10 file:text-white file:text-xs file:uppercase file:tracking-widest"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.3em] hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {uploading ? '[ .... please wait uploading .... ]' : 'Upload'}
        </button>
      </form>

      {loading && (
        <div className="border border-white/10 p-12 text-center">
          <p className="text-xs text-white/40 tracking-[0.4em] uppercase animate-pulse">
            [ .... please wait loading .... ]
          </p>
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {customers.map((c) => {
            const isDeleting = deleting === c._id;
            return (
              <div key={c._id} className="relative aspect-square bg-white/5 border border-white/10 overflow-hidden group">
                <Image src={c.image} alt={c.ownerName} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
                  <p className="text-[10px] text-white/60 uppercase tracking-wider truncate">{c.ownerName}</p>
                  <p className="text-xs text-white font-medium truncate">{c.model}</p>
                </div>
                <button
                  onClick={() => handleDelete(c._id, c.ownerName)}
                  disabled={isDeleting}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-500/80 text-white text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {isDeleting ? '...' : 'X'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}