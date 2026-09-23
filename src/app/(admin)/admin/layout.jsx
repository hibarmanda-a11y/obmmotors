'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/cars', label: 'Inventory' },
  { href: '/admin/customers', label: 'Happy Customers' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin-login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/10 flex flex-col bg-black">
        <div className="px-7 py-8 border-b border-white/10">
          <Link
            href="/admin"
            className="block text-sm font-extralight tracking-[0.4em] text-white uppercase"
          >
            OB MOTORS
          </Link>
          <p className="text-[9px] tracking-[0.3em] text-white/40 uppercase mt-3">
            Admin Console
          </p>
        </div>

        <nav className="flex-1 py-6">
          {NAV.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`block px-7 py-4 text-[11px] tracking-[0.25em] uppercase transition-colors border-l-2 ${
                  isActive
                    ? 'border-white text-white bg-white/[0.03]'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-7 py-6 border-t border-white/10">
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