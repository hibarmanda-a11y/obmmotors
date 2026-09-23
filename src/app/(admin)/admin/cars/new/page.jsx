'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const INITIAL_FORM = {
  title: '',
  slug: '',
  specs: {
    brand: '',
    model: '',
    reg_year: '',
    mileage: '',
    engine_cc: '',
    transmission: 'AUTOMATIC',
    fuel_type: 'PETROL',
    drive_type: 'AWD',
    wheel: '',
    exterior_color: '',
    body_style: 'SUV',
    condition: 'Reconditioned',
  },
  description: '',
  engine_details: '',
  exterior_features: '',
  interior_features: '',
  safety_features: '',
  video_url: '',
  price: '',
  priceDisplay: '',
  status: 'available',
  isFeatured: false,
};

export default function NewCarPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const updateSpec = (key, value) => {
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));
  };

  const handleTitleChange = (value) => {
    setForm((f) => ({
      ...f,
      title: value,
      slug: value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.specs.brand) {
      setError('Title and Brand are required');
      return;
    }
    if (!thumbnailFile) {
      setError('Thumbnail image is required');
      return;
    }

    setUploading(true);

    try {
      setStatus('Uploading thumbnail...');
      const thumbForm = new FormData();
      thumbForm.append('files', thumbnailFile);
      thumbForm.append('folder', 'cars');
      thumbForm.append('slug', form.slug);
      thumbForm.append('prefix', 'thumbnail');

      const thumbRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: thumbForm,
      });
      const thumbData = await thumbRes.json();
      if (!thumbRes.ok) throw new Error(thumbData.error);

      let relatedUrls = [];
      if (relatedFiles.length > 0) {
        setStatus(`Uploading ${relatedFiles.length} images...`);
        const relForm = new FormData();
        relatedFiles.forEach((f) => relForm.append('files', f));
        relForm.append('folder', 'cars');
        relForm.append('slug', form.slug);
        relForm.append('prefix', 'related');

        const relRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: relForm,
        });
        const relData = await relRes.json();
        if (!relRes.ok) throw new Error(relData.error);
        relatedUrls = relData.urls || [];
      }

      setStatus('Saving to database...');

      const splitLines = (str) =>
        str.split('\n').map((s) => s.trim()).filter(Boolean);

      const payload = {
        ...form,
        thumbnail: thumbData.urls[0],
        related_images: relatedUrls,
        price: form.price ? Number(form.price) : undefined,
        engine_details: splitLines(form.engine_details),
        exterior_features: splitLines(form.exterior_features),
        interior_features: splitLines(form.interior_features),
        safety_features: splitLines(form.safety_features),
      };

      const res = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus('Done!');
      router.push('/admin/cars');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Upload failed');
      setStatus('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/admin/cars"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase mb-6"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Inventory
        </Link>

        <h1 className="text-3xl sm:text-4xl font-normal text-white tracking-tight">
          Add New Car
        </h1>
        <p className="text-sm text-white/50 mt-2">
          Fill in the details below. All fields marked with <span className="text-white">*</span> are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* === BASIC INFO === */}
        <Section title="Basic Information" number="01">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Title *"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Mercedes-Benz Maybach GLS 600"
              full
            />
            <Input
              label="Slug (auto-generated)"
              value={form.slug}
              onChange={() => {}}
              placeholder="mercedes-benz-maybach-gls-600"
              disabled
              full
            />
          </div>
        </Section>

        {/* === IMAGES === */}
        <Section title="Images" number="02">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FileInput
              label="Thumbnail *"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              file={thumbnailFile}
              hint="Main image — 4:3 ratio recommended"
            />
            <FileInput
              label="Gallery Images"
              accept="image/*"
              multiple
              onChange={(e) => setRelatedFiles(Array.from(e.target.files || []))}
              files={relatedFiles}
              hint={`${relatedFiles.length} file(s) selected`}
            />
          </div>
        </Section>

        {/* === SPECS === */}
        <Section title="Specifications" number="03">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input label="Brand *" value={form.specs.brand} onChange={(v) => updateSpec('brand', v)} placeholder="Mercedes-Benz" />
            <Input label="Model" value={form.specs.model} onChange={(v) => updateSpec('model', v)} placeholder="2024" />
            <Input label="Reg. Year" value={form.specs.reg_year} onChange={(v) => updateSpec('reg_year', v)} placeholder="2024" />
            <Input label="Mileage" value={form.specs.mileage} onChange={(v) => updateSpec('mileage', v)} placeholder="00 KM" />
            <Input label="Engine (CC)" value={form.specs.engine_cc} onChange={(v) => updateSpec('engine_cc', v)} placeholder="4000" />
            <Select
              label="Transmission"
              value={form.specs.transmission}
              onChange={(v) => updateSpec('transmission', v)}
              options={['AUTOMATIC', 'MANUAL']}
            />
            <Select
              label="Fuel Type"
              value={form.specs.fuel_type}
              onChange={(v) => updateSpec('fuel_type', v)}
              options={['PETROL', 'OCTANE', 'DIESEL', 'ELECTRIC', 'HYBRID']}
            />
            <Select
              label="Drive Type"
              value={form.specs.drive_type}
              onChange={(v) => updateSpec('drive_type', v)}
              options={['AWD', 'FWD', 'RWD', '4WD']}
            />
            <Input label="Wheel" value={form.specs.wheel} onChange={(v) => updateSpec('wheel', v)} placeholder="23 Inch" />
            <Input label="Exterior Color" value={form.specs.exterior_color} onChange={(v) => updateSpec('exterior_color', v)} placeholder="Black" />
            <Select
              label="Body Style"
              value={form.specs.body_style}
              onChange={(v) => updateSpec('body_style', v)}
              options={['SUV', 'Sedan', 'Coupe', 'Hatchback']}
            />
            <Select
              label="Condition"
              value={form.specs.condition}
              onChange={(v) => updateSpec('condition', v)}
              options={['Reconditioned', 'Brand New', 'Pre-Owned']}
            />
          </div>
        </Section>

        {/* === PRICING === */}
        <Section title="Pricing" number="04">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Price (numeric)"
              type="number"
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
              placeholder="250000"
            />
            <Input
              label="Price Display"
              value={form.priceDisplay}
              onChange={(v) => setForm({ ...form, priceDisplay: v })}
              placeholder="$250,000 or Contact for Price"
            />
          </div>
        </Section>

        {/* === DESCRIPTION === */}
        <Section title="Description" number="05">
          <Textarea
            label="Full Description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            rows={4}
            placeholder="Describe the car, its history, condition, and any notable features..."
          />
        </Section>

        {/* === FEATURES === */}
        <Section title="Features" number="06">
          <p className="text-xs text-white/50 -mt-3 mb-5">
            Enter one feature per line. They will be displayed as bullet points.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea
              label="Engine & Performance"
              value={form.engine_details}
              onChange={(v) => setForm({ ...form, engine_details: v })}
              rows={5}
              placeholder="4.0L Twin-Turbo V8&#10;580 HP&#10;9G-TRONIC"
            />
            <Textarea
              label="Exterior Features"
              value={form.exterior_features}
              onChange={(v) => setForm({ ...form, exterior_features: v })}
              rows={5}
              placeholder="LED Headlights&#10;Panoramic Sunroof&#10;23-inch Alloys"
            />
            <Textarea
              label="Interior Features"
              value={form.interior_features}
              onChange={(v) => setForm({ ...form, interior_features: v })}
              rows={5}
              placeholder="Nappa Leather&#10;MBUX Display&#10;Burmester Audio"
            />
            <Textarea
              label="Safety Features"
              value={form.safety_features}
              onChange={(v) => setForm({ ...form, safety_features: v })}
              rows={5}
              placeholder="Adaptive Cruise&#10;Lane Assist&#10;360° Camera"
            />
          </div>
        </Section>

        {/* === SETTINGS === */}
        <Section title="Publishing" number="07">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Status"
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v })}
              options={['available', 'sold', 'reserved']}
            />
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-white cursor-pointer"
                />
                <span className="text-sm text-white/80 group-hover:text-white">
                  Mark as Featured
                </span>
              </label>
            </div>
          </div>
        </Section>

        {/* Error */}
        {error && (
          <div className="border border-red-500/40 bg-red-500/5 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Status */}
        {status && (
          <div className="border border-white/20 bg-white/[0.03] p-4 flex items-center gap-3">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <p className="text-xs text-white/80 tracking-[0.2em] uppercase">
              {status}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={uploading}
            className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Saving...' : 'Create Car'}
          </button>
          <Link
            href="/admin/cars"
            className="px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-white/5 hover:border-white/40 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ===== Components ===== */

function Section({ title, number, children }) {
  return (
    <div className="border border-white/15 bg-[#0A0A0B] p-6 sm:p-8">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
        <span className="text-[10px] font-mono text-white/40 tracking-widest">
          {number}
        </span>
        <h2 className="text-base font-semibold text-white tracking-wide">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder = '', disabled = false, full = false }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-[11px] font-semibold tracking-[0.15em] text-white/70 uppercase mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 text-sm bg-black border border-white/20 text-white placeholder-white/30 caret-white focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4, placeholder = '' }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.15em] text-white/70 uppercase mb-2">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-sm bg-black border border-white/20 text-white placeholder-white/30 caret-white focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-colors resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.15em] text-white/70 uppercase mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 text-sm bg-black border border-white/20 text-white focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-colors appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-black text-white">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, accept, multiple = false, onChange, file, files, hint }) {
  const displayText = file?.name || (files?.length ? `${files.length} file(s)` : 'No file chosen');

  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.15em] text-white/70 uppercase mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex items-center gap-3 px-4 py-3 bg-black border border-white/20 hover:border-white/40 transition-colors">
          <span className="px-3 py-1.5 bg-white/10 border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest">
            {multiple ? 'Choose Files' : 'Choose File'}
          </span>
          <span className="text-sm text-white/60 truncate">{displayText}</span>
        </div>
      </div>
      {hint && <p className="text-[10px] text-white/40 mt-2 tracking-wider">{hint}</p>}
    </div>
  );
}