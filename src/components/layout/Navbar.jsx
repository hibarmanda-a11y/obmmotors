'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from 'react-icons/fa';
import Wishlist from '@/components/ui/Wishlist';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/buy', label: 'Buy' },
    { href: '/sell', label: 'Sell' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav 
      className={`fixed top-0  left-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-[#060714]/95 backdrop-blur-md border-white/10 shadow-2xl' 
          : 'bg-[#060714] border-transparent'
      }`}
    >
      <div className="w-full px-6 md:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-9 h-9 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
               <span className="text-[#060714] font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">CAR sawari</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#5842f1] text-white shadow-[0_0_20px_rgba(88,66,241,0.4)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Auth Actions & Wishlist */}
          <div className="hidden lg:flex items-center space-x-4">
            <Wishlist />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={isAdmin ? '/admin' : '/profile'}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  <FaUser className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-8 py-2.5 rounded-xl bg-white text-[#060714] font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Wishlist />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-4 rounded-xl text-lg font-medium transition-all ${
                  pathname === href 
                    ? 'bg-[#5842f1] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href={isAdmin ? '/admin' : '/profile'} className="flex items-center justify-center space-x-2 py-4 bg-white/5 text-white rounded-xl font-medium">
                    <FaUser /> <span>Dashboard</span>
                  </Link>
                  <button onClick={handleSignOut} className="py-4 bg-red-500/10 text-red-400 rounded-xl font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="py-4 bg-white text-black text-center rounded-xl font-bold">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}