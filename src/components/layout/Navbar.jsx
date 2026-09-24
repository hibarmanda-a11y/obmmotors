'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll when menu open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavigation = () => setIsMenuOpen(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Cars' },
    { href: '/about', label: 'About Us' },
    { href: '/sell', label: 'Sell Your Car' },
  ];

  return (
    <>
      {/* Navbar — NO BACKGROUND, FIXED, ALWAYS ON TOP */}
      <nav className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
        <div className="w-full px-6 md:px-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="pointer-events-auto text-xl sm:text-2xl font-extralight tracking-[0.3em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              OB MOTORS
            </Link>

            {/* 3-Bar Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="pointer-events-auto p-2 text-white hover:opacity-70 transition-opacity drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              aria-label="Open Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black">
          {/* Header */}
          <div className="w-full px-6 md:px-10 h-20 flex justify-between items-center border-b border-white/10">
            <Link
              href="/"
              onClick={handleNavigation}
              className="text-xl sm:text-2xl font-extralight tracking-[0.3em] text-white uppercase"
            >
              OB MOTORS
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-white hover:opacity-70 transition-opacity"
              aria-label="Close Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
            <nav className="flex flex-col gap-6 sm:gap-8">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={handleNavigation}
                    className={`text-3xl sm:text-5xl md:text-6xl font-extralight tracking-tight transition-colors ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}