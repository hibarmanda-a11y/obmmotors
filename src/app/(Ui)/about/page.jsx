import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export const metadata = {
  title: 'About | OB Motors',
  description: 'Premium car dealership — curated collection, exceptional service.',
};

const VALUES = [
  {
    number: '01',
    title: 'Curated Selection',
    description:
      'Every vehicle in our inventory is hand-selected for quality, provenance, and condition.',
  },
  {
    number: '02',
    title: 'Transparent Dealing',
    description:
      'Clear pricing, documented history, and honest communication — no hidden surprises.',
  },
  {
    number: '03',
    title: 'Enduring Support',
    description:
      'From first inquiry to post-purchase care, our team stays available for you.',
  },
  {
    number: '04',
    title: 'Detail Obsessed',
    description:
      'Meticulous inspection and presentation standards on every single vehicle.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 sm:py-28">
          <p className="text-[10px] tracking-[0.4em] text-[#C9A961] uppercase mb-6">
            About OB Motors
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight leading-[1.05] max-w-4xl">
            A dealership built on
            <br />
            <span className="text-white/40">trust, taste, and precision.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-sm sm:text-base text-white/50 leading-relaxed font-light">
            OB Motors is a curated marketplace for exceptional automobiles.
            We connect discerning buyers with vehicles that meet our standards
            for quality, presentation, and provenance — nothing less.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 sm:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-4">
              Our Story
            </p>
            <h2 className="text-2xl sm:text-3xl font-extralight leading-snug">
              Founded on a simple idea — that buying a car should feel
              considered, not transactional.
            </h2>
          </div>
          <div className="space-y-6 text-sm text-white/60 leading-relaxed font-light">
            <p>
              What began as a small collection of handpicked vehicles has grown
              into a trusted destination for premium automobiles. Along the
              way, one thing has never changed: our refusal to compromise on
              quality.
            </p>
            <p>
              We work directly with owners, importers, and trusted partners to
              bring you cars that have been properly maintained, honestly
              described, and carefully presented.
            </p>
            <p>
              Whether youre searching for a reconditioned daily driver or a
              rare weekend machine, every vehicle on our floor receives the
              same attention to detail.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 sm:py-24">
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-12">
            What We Stand For
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {VALUES.map((value) => (
              <div
                key={value.number}
                className="bg-black p-8 sm:p-10 flex flex-col"
              >
                <span className="text-[#C9A961] text-xs tracking-[0.3em] font-light mb-6">
                  {value.number}
                </span>
                <h3 className="text-lg font-light mb-4">{value.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 sm:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { number: '15+', label: 'Vehicles in Stock' },
              { number: '200+', label: 'Happy Clients' },
              { number: '10+', label: 'Years Combined Experience' },
              { number: '100%', label: 'Inspection Coverage' },
            ].map((stat) => (
              <div key={stat.label} className="border-l border-white/10 pl-6">
                <p className="text-3xl sm:text-4xl font-extralight text-white">
                  {stat.number}
                </p>
                <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mt-3">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-[#C9A961] uppercase mb-6">
                Get in Touch
              </p>
              <h2 className="text-2xl sm:text-4xl font-extralight leading-snug">
                Lets talk about your
                <br />
                <span className="text-white/40">next vehicle.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm text-white/50 leading-relaxed font-light">
                Reach out for inquiries, stock updates, or a private viewing.
                We respond to every message personally.
              </p>

              <div className="mt-10 space-y-5">
                <a
                  href="tel:+8801620885976"
                  className="flex items-center gap-4 text-sm text-white/70 hover:text-white transition-colors group"
                >
                  <span className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-[#C9A961] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  +880 1620-885976
                </a>
                <a
                  href="mailto:hibarmanda2@gmail.com"
                  className="flex items-center gap-4 text-sm text-white/70 hover:text-white transition-colors group"
                >
                  <span className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-[#C9A961] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  hibarmanda2@gmail.com
                </a>
                <div className="flex items-start gap-4 text-sm text-white/70 group">
                  <span className="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#C9A961] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">
                    KA-61/6A Pragati Sarani<br />
                    Baridhara, Dhaka-1212<br />
                    Bangladesh
                  </span>
                </div>
              </div>

              {/* Socials */}
              <div className="mt-10 flex items-center gap-3">
                <a
                  href="https://www.facebook.com/opuifnwhy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white transition-all"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/visualsbyopu/?__pwa=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white transition-all"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/8801620885976"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right side: CTA Card */}
            <div className="border border-white/10 p-8 sm:p-10 flex flex-col justify-between min-h-[400px]">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-6">
                  Book a Private Viewing
                </p>
                <h3 className="text-xl sm:text-2xl font-extralight leading-snug">
                  Come see the collection in person.
                </h3>
                <p className="mt-4 text-sm text-white/50 leading-relaxed font-light">
                  Schedule a private appointment at our Dhaka showroom.
                  Complimentary refreshments and dedicated consultation.
                </p>
              </div>

              <div className="mt-10 space-y-3">
                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#C9A961] text-black text-xs font-semibold uppercase tracking-[0.3em] hover:bg-[#D4B876] transition-colors"
                >
                  Book Appointment
                </Link>
                <Link
                  href="/cars"
                  className="w-full inline-flex items-center justify-center px-6 py-4 border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors"
                >
                  Browse Inventory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Branding */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 text-center">
          <p className="text-[10px] tracking-[0.5em] text-white/30 uppercase">
            OB MOTORS — DRIVE YOUR DREAM
          </p>
        </div>
      </section>
    </div>
  );
}