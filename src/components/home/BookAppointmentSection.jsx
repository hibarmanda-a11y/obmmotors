'use client';

import { useState } from 'react';
import Image from 'next/image';
import BookAppointmentModal from './BookAppointmentModal';

export default function BookAppointmentSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="relative h-[400px] sm:h-[500px] overflow-hidden">
        {/* ✅ Image with blackish overlay */}
        <Image
          src="/assets/view.png"
          alt="OB Motors Showroom"
          fill
          quality={100}
          sizes="100vw"
          priority
          className="object-cover"
        />

        {/* ✅ Blackish overlay — heavy */}
        <div className="absolute inset-0 bg-black/70" />

        {/* ✅ Gradient overlay — darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            Visit Our Showroom
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/80 mt-4 max-w-xl font-light tracking-wide">
            Book a personal appointment with our sales team. Experience the cars you love, up close.
          </p>

          <button
            onClick={() => setOpen(true)}
            className="group mt-10 inline-flex items-center gap-3 px-8 py-4 text-sm font-bold bg-white text-black rounded-full hover:bg-white/90 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-300 tracking-wide uppercase"
          >
            <span>Book Appointment</span>
            <span className="flex items-center justify-center w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {open && <BookAppointmentModal onClose={() => setOpen(false)} />}
    </>
  );
}