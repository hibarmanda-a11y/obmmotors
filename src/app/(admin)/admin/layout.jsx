'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/cars', label: 'Cars' },
  { href: '/admin/sell', label: 'Sell Requests' },
  { href: '/admin/appointments', label: 'Appointments' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/admin-login';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/5 flex flex-col bg-[#0A0A0B]">
        <div className="px-8 py-8">
          <Link
            href="/admin"
            className="block text-sm font-light tracking-[0.35em] text-white uppercase"
          >
            OB MOTORS
          </Link>
          <p className="text-[9px] tracking-[0.3em] text-white/30 uppercase mt-2">
            Admin Console
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label }) => {
            const isActive =
              pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`block px-4 py-3 text-[11px] tracking-[0.2em] uppercase transition-all rounded-md ${
                  isActive
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-7 py-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="text-[10px] tracking-[0.3em] text-white/40 hover:text-red-400 uppercase transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
    </div>
  );
}