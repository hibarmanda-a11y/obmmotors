'use client';

import { useState, useEffect } from 'react';
import { BD_LOCATIONS } from '@/app/data/bdLocations';

function generateTimeSlots() {
  const slots = [];
  for (let h = 10; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 22 && m > 0) break;
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const min = m.toString().padStart(2, '0');
      slots.push(`${hour12}:${min} ${ampm}`);
    }
  }
  return slots;
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = generateTimeSlots();

export default function BookAppointmentModal({ onClose }) {
  const [step, setStep] = useState(1);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '+880',
    district: '',
    area: '',
    customLocation: '',
    note: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState('sent');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    fetch(`/api/appointment?date=${dateStr}`)
      .then((r) => r.json())
      .then((d) => setBookedSlots(d.bookedSlots || []))
      .catch(() => setBookedSlots([]));
  }, [selectedDate, viewYear, viewMonth]);

  const days = getCalendarDays(viewYear, viewMonth);
  const todayDate = today.getDate();
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const dateStr = selectedDate
    ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
    : '';

  const isSlotBooked = (time) => bookedSlots.some((s) => s.date === dateStr && s.time === time);

  const handleSubmit = async () => {
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill all required fields');
      return;
    }
    if (!form.district) {
      setError('Please select your district');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: { district: form.district, area: form.area },
          customLocation: form.customLocation,
          note: form.note,
          date: dateStr,
          time: selectedTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to book');

      // ✅ Email status check
      setEmailStatus(data.emailStatus || 'sent');
      setSuccess(true);

      // Auto-close only if email sent successfully
      // If email failed, user should read the message
      if (data.emailStatus !== 'failed') {
        setTimeout(() => onClose(), 5000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0E0E0F] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-[#C9A961] uppercase">
              OB MOTORS
            </p>
            <h2 className="text-2xl font-serif font-light text-white mt-2 tracking-wide">
              Book an Appointment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success */}
        {success ? (
          <div className="p-12 sm:p-16 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto border border-[#C9A961] rounded-full flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-[#C9A961]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <p className="text-[10px] font-semibold tracking-[0.4em] text-[#C9A961] uppercase mb-4">
              Booking Confirmed
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide">
              Your Appointment is Booked
            </h3>

            {/* Divider */}
            <span className="block h-px w-16 bg-[#C9A961]/40 mx-auto my-6" />

            {/* Email Info Box */}
            {emailStatus === 'sent' ? (
              <div className="max-w-md mx-auto border border-[#C9A961]/20 bg-[#C9A961]/5 p-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 border border-[#C9A961]/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#C9A961]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.3em] text-[#C9A961] uppercase mb-2">
                      Check Your Mail Inbox
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed font-light">
                      We have sent a confirmation email to{' '}
                      <span className="text-white font-medium">{form.email}</span>।
                      Please check your inbox and spam folder.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto border border-yellow-500/20 bg-yellow-500/5 p-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 border border-yellow-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.3em] text-yellow-500 uppercase mb-2">
                      Email Pending
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed font-light">
                      Your appointment has been saved. Confirmation email is being processed — our team will reach out shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div className="max-w-md mx-auto mt-6 border-t border-white/10 pt-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/40 uppercase tracking-widest">Date</span>
                <span className="text-white font-light">{selectedDate} {MONTHS[viewMonth]} {viewYear}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40 uppercase tracking-widest">Time</span>
                <span className="text-[#C9A961] font-light">{selectedTime}</span>
              </div>
            </div>

            {/* Close hint */}
            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-8">
              Closing in a moment...
            </p>
          </div>
        ) : (
          <div className="p-8">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-[11px] text-white/50 tracking-wider uppercase mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>30 min</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Phone call</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                <span>Asia/Dhaka</span>
              </div>
            </div>

            {/* Step 1: Date + Time */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {selectedTime ? (
                    <div className="border border-[#C9A961]/30 bg-[#C9A961]/5 p-8 text-center">
                      <p className="text-[10px] text-[#C9A961] uppercase tracking-[0.3em] mb-4">
                        Selected
                      </p>
                      <p className="text-2xl font-serif font-light text-white">
                        {selectedDate} {MONTHS[viewMonth]}
                      </p>
                      <p className="text-lg text-[#C9A961] mt-2 tracking-wide">
                        {selectedTime}
                      </p>
                      <button
                        onClick={() => setSelectedTime(null)}
                        className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest mt-6 underline"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <button
                          onClick={() => {
                            if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
                            else setViewMonth(viewMonth - 1);
                            setSelectedDate(null);
                          }}
                          className="p-2 text-white/50 hover:text-white"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <p className="text-sm font-serif font-light tracking-widest text-white uppercase">
                          {MONTHS[viewMonth]} {viewYear}
                        </p>
                        <button
                          onClick={() => {
                            if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
                            else setViewMonth(viewMonth + 1);
                            setSelectedDate(null);
                          }}
                          className="p-2 text-white/50 hover:text-white"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-3">
                        {DAYS.map((d) => (
                          <div key={d} className="text-[10px] font-medium text-white/30 text-center uppercase tracking-widest py-1">
                            {d}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {days.map((d, i) => {
                          if (d === null) return <div key={i} />;
                          const isPast = isCurrentMonth && d < todayDate;
                          return (
                            <button
                              key={i}
                              disabled={isPast}
                              onClick={() => setSelectedDate(d)}
                              className={`aspect-square text-xs font-light rounded-none transition-colors ${
                                selectedDate === d
                                  ? 'bg-[#C9A961] text-black'
                                  : isPast
                                  ? 'text-white/15 cursor-not-allowed'
                                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {selectedDate ? (
                    <div className="border border-white/10 p-6">
                      <p className="text-[10px] font-medium text-white/50 uppercase tracking-[0.3em] mb-4">
                        Select Time
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                        {TIME_SLOTS.map((t) => {
                          const booked = isSlotBooked(t);
                          return (
                            <button
                              key={t}
                              disabled={booked}
                              onClick={() => setSelectedTime(t)}
                              className={`py-2.5 text-xs font-light rounded-none border transition-colors ${
                                selectedTime === t
                                  ? 'bg-[#C9A961] text-black border-[#C9A961]'
                                  : booked
                                  ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed line-through'
                                  : 'border-white/10 text-white/70 hover:border-[#C9A961] hover:text-white'
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-white/10 p-16 text-center h-full flex items-center justify-center">
                      <p className="text-xs text-white/30 uppercase tracking-[0.3em]">
                        Select a date first
                      </p>
                    </div>
                  )}

                  {selectedTime && (
                    <button
                      onClick={() => setStep(2)}
                      className="w-full mt-6 py-4 bg-[#C9A961] text-black text-xs font-semibold uppercase tracking-[0.3em] hover:bg-[#D4B876] transition-colors"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Form */}
            {step === 2 && (
              <div>
                <div className="bg-[#C9A961]/5 border border-[#C9A961]/20 p-4 mb-8 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-white/40 uppercase tracking-widest mr-2">Selected:</span>
                    <span className="font-light text-white">
                      {selectedDate} {MONTHS[viewMonth]} {viewYear} — {selectedTime}
                    </span>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[10px] font-medium text-[#C9A961] hover:underline uppercase tracking-widest"
                  >
                    Change
                  </button>
                </div>

                <h3 className="text-xl font-serif font-light text-white mb-2 tracking-wide">
                  Enter Details
                </h3>
                <p className="text-[10px] text-white/40 mb-6 uppercase tracking-widest">
                  Fields marked * are required
                </p>

                <div className="mb-5">
                  <label className="block text-[10px] font-medium text-white/60 uppercase tracking-widest mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-transparent border border-white/10 text-white focus:border-[#C9A961] outline-none transition-colors"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] font-medium text-white/60 uppercase tracking-widest mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-transparent border border-white/10 text-white focus:border-[#C9A961] outline-none transition-colors"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] font-medium text-white/60 uppercase tracking-widest mb-2">
                    Phone *
                  </label>
                  <div className="flex items-center border border-white/10 focus-within:border-[#C9A961] transition-colors">
                    <div className="flex items-center gap-2 px-4 py-3 border-r border-white/10">
                      <span className="text-base">🇧🇩</span>
                      <span className="text-xs text-white/60">+880</span>
                    </div>
                    <input
                      type="tel"
                      value={form.phone.replace('+880', '')}
                      onChange={(e) => setForm({ ...form, phone: '+880' + e.target.value.replace(/\D/g, '') })}
                      className="flex-1 px-4 py-3 text-sm bg-transparent text-white outline-none"
                      placeholder="1XXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] font-medium text-white/60 uppercase tracking-widest mb-2">
                    Coming From *
                  </label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value, area: '' })}
                    className="w-full px-4 py-3 text-sm bg-[#0E0E0F] border border-white/10 text-white focus:border-[#C9A961] outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {Object.keys(BD_LOCATIONS).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {form.district && (
                  <div className="mb-5">
                    <label className="block text-[10px] font-medium text-white/60 uppercase tracking-widest mb-2">
                      Area
                    </label>
                    <select
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-[#0E0E0F] border border-white/10 text-white focus:border-[#C9A961] outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select Area</option>
                      {BD_LOCATIONS[form.district].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                      <option value="__other__">Not find location?</option>
                    </select>
                  </div>
                )}

                {(form.area === '__other__' || form.customLocation) && (
                  <div className="mb-5">
                    <label className="block text-[10px] font-medium text-white/60 uppercase tracking-widest mb-2">
                      Type your location
                    </label>
                    <input
                      type="text"
                      value={form.customLocation}
                      onChange={(e) => setForm({ ...form, customLocation: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-transparent border border-white/10 text-white focus:border-[#C9A961] outline-none transition-colors"
                    />
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-[10px] font-medium text-white/60 uppercase tracking-widest mb-2">
                    Notes
                  </label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 text-sm bg-transparent border border-white/10 text-white focus:border-[#C9A961] outline-none transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="mb-5 p-3 border border-red-500/30 bg-red-500/5">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 bg-[#C9A961] text-black text-xs font-semibold uppercase tracking-[0.3em] hover:bg-[#D4B876] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Booking...' : 'Book Now'}
                </button>

                <p className="text-[10px] text-white/30 text-center mt-4 uppercase tracking-widest">
                  By proceeding you agree to OB Motors Terms
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}