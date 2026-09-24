'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function SellPage() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    carName: '',
    model: '',
    regYear: '',
    mileage: '',
    offeredPrice: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const valid = files.filter((f) => {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} — max 10MB`);
        return false;
      }
      return true;
    });
    setImages((prev) => [...prev, ...valid]);
  };

  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) return toast.error('Please accept the Terms of Use');
    if (images.length === 0) return toast.error('Please upload at least one image');

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('acceptedTerms', 'true');
      images.forEach((file) => formData.append('images', file));

      const res = await fetch('/api/sell', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSuccess(true);
      toast.success('Request submitted!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">

      {/* Hero animations */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lineGrow {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        .anim-fade-up {
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .anim-fade-in {
          opacity: 0;
          animation: fadeIn 1.2s ease-out forwards;
        }
        .anim-line {
          opacity: 0;
          transform-origin: center;
          animation: lineGrow 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-fade-up,
          .anim-fade-in,
          .anim-line {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      {/* ============= HERO — FULL BACKGROUND IMAGE + OVERLAY TEXT ============= */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Full background image */}
        <Image
          src="/assets/sellbg.jpeg"
          alt="Sell your car with OB Motors"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

        {/* Overlay Text — centered with stagger animation */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p
            className="anim-fade-up text-[10px] sm:text-[11px] tracking-[0.5em] text-white/50 uppercase mb-6"
            style={{ animationDelay: '0.1s' }}
          >
            Sell With OB Motors
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
            <span
              className="anim-fade-up block font-semibold"
              style={{ animationDelay: '0.35s' }}
            >
              Want a New Car?
            </span>
            <span
              className="anim-fade-up block font-semibold"
              style={{ animationDelay: '0.55s' }}
            >
              Sell Your Old One.
            </span>
            <span
              className="anim-fade-up block font-extralight text-white/60 mt-2"
              style={{ animationDelay: '0.75s' }}
            >
              It Could Be Someone's Dream.
            </span>
          </h1>

          <span
            className="anim-line block h-px w-16 bg-white/30 mx-auto mt-8 mb-8"
            style={{ animationDelay: '1s' }}
          />

          <p
            className="anim-fade-in text-sm sm:text-base text-white/60 leading-relaxed max-w-lg mx-auto"
            style={{ animationDelay: '1.2s' }}
          >
            Submit your vehicle details below. Our team will contact you within 24 hours for a free professional inspection.
          </p>
        </div>
      </section>

      {/* ============= FORM SECTION ============= */}
      <section className="bg-black py-16 px-4">
        <div className="max-w-md mx-auto">

          {success ? (
            <div className="bg-[#0F0F10] border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Thank you, {form.name}!</h2>
              <p className="text-sm text-white/50 mb-6">
                We've received your request for <strong className="text-white">{form.carName}</strong>.
                Check <strong className="text-white">{form.email}</strong> for confirmation.
              </p>
              <a
                href="https://wa.me/8801620885976"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          ) : (
            <div className="bg-[#0F0F10] border border-white/10 rounded-2xl p-6 sm:p-7">

              <h2 className="text-xl sm:text-2xl font-semibold text-white text-center mb-6">
                Ready to sell your car?
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name:"
                  required
                  className="w-full px-4 py-3 text-sm bg-transparent border border-white/15 rounded-lg text-white placeholder-white/40 focus:border-white/60 outline-none transition-colors"
                />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your Phone Number:"
                  required
                  className="w-full px-4 py-3 text-sm bg-transparent border border-white/15 rounded-lg text-white placeholder-white/40 focus:border-white/60 outline-none transition-colors"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email:"
                  required
                  className="w-full px-4 py-3 text-sm bg-transparent border border-white/15 rounded-lg text-white placeholder-white/40 focus:border-white/60 outline-none transition-colors"
                />

                <input
                  type="text"
                  name="carName"
                  value={form.carName}
                  onChange={handleChange}
                  placeholder="Car Name:"
                  required
                  className="w-full px-4 py-3 text-sm bg-transparent border border-white/15 rounded-lg text-white placeholder-white/40 focus:border-white/60 outline-none transition-colors"
                />

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Model"
                    className="w-full px-3 py-3 text-sm bg-transparent border border-white/15 rounded-lg text-white placeholder-white/40 focus:border-white/60 outline-none transition-colors"
                  />
                  <input
                    type="text"
                    name="regYear"
                    value={form.regYear}
                    onChange={handleChange}
                    placeholder="Reg. Year"
                    required
                    className="w-full px-3 py-3 text-sm bg-transparent border border-white/15 rounded-lg text-white placeholder-white/40 focus:border-white/60 outline-none transition-colors"
                  />
                  <input
                    type="text"
                    name="mileage"
                    value={form.mileage}
                    onChange={handleChange}
                    placeholder="Mileage"
                    className="w-full px-3 py-3 text-sm bg-transparent border border-white/15 rounded-lg text-white placeholder-white/40 focus:border-white/60 outline-none transition-colors"
                  />
                </div>

                <input
                  type="number"
                  name="offeredPrice"
                  value={form.offeredPrice}
                  onChange={handleChange}
                  placeholder="Offered Price"
                  className="w-full px-4 py-3 text-sm bg-transparent border border-white/15 rounded-lg text-white placeholder-white/40 focus:border-white/60 outline-none transition-colors"
                />

                {/* Image upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                    className="hidden"
                  />

                  {images.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 border border-dashed border-white/20 rounded-lg text-sm text-white/60 hover:border-white/50 hover:text-white transition-colors"
                    >
                      Upload Car Images
                    </button>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((file, i) => (
                        <div key={i} className="relative aspect-square bg-white/5 rounded-lg overflow-hidden group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${i}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/80 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes className="w-2 h-2" />
                          </button>
                        </div>
                      ))}
                      {images.length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square border border-dashed border-white/20 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/50 text-xs transition-colors"
                        >
                          +
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <button
                  type="button"
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className="flex items-start gap-3 cursor-pointer pt-1 text-left w-full"
                >
                  <div
                    className={`shrink-0 w-4 h-4 mt-0.5 rounded flex items-center justify-center transition-colors ${
                      acceptedTerms ? 'bg-white' : 'border border-white/30'
                    }`}
                  >
                    {acceptedTerms && (
                      <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-white/60">
                    I accept and agree to the{' '}
                    <Link href="/terms" className="text-white underline hover:text-white/80">
                      Terms Of Use
                    </Link>
                  </span>
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>

                {/* WhatsApp — SAME STYLE AS FOOTER */}
                <a
                  href="https://wa.me/8801620885976"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  Need More Details? WhatsApp
                </a>

              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}