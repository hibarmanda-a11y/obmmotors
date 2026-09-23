import Link from 'next/link';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Cars' },
    { href: '/about', label: 'About Us' },
    { href: '/sell', label: 'Sell Your Car' },
   
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <span className="text-white/30">–</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-5">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+8801620885976" className="hover:text-white transition-colors">
                  +880 1620-885976
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:hibarmanda2@gmail.com" className="hover:text-white transition-colors">
                  hibarmanda2@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>
                  KA-61/6A Pragati Sarani<br />
                  Baridhara, Dhaka-1212<br />
                  Bangladesh
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Keep In Touch */}
          <div>
            <h3 className="text-lg font-bold text-white mb-5">Keep In Touch</h3>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/8801620885976"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition-colors w-full justify-center mb-4"
            >
              <FaWhatsapp className="w-5 h-5" />
              Chat on WhatsApp
            </a>

            <p className="text-sm text-white/60 leading-relaxed mb-5">
              For inquiries, latest stock updates, or personalized assistance, chat with us on WhatsApp.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/opuifnwhy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:bg-white hover:text-black transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/visualsbyopu/?__pwa=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:bg-white hover:text-black transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 4: Google Map */}
          <div>
            <h3 className="text-lg font-bold text-white mb-5">Visit Us</h3>
            <div className="w-full h-[200px] border border-white/10 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.6424!2d90.4231!3d23.8103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7f7f7f7f7f7%3A0x7f7f7f7f7f7f7f7f!2sBaridhara%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="OB Motors Location"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              OB MOTORS
            </span>
          </div>
          <p className="text-xs text-white/40">
            Copyright © {currentYear} All rights reserved | @obmotors
          </p>
        </div>
      </div>
    </footer>
  );
}