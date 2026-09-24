import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { headers } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OB Motors — Premium Car Dealer',
  description: 'Find your dream car at OB Motors',
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // ✅ Hide Navbar + Footer on admin/auth pages
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/admin-login') || pathname.startsWith('/login') || pathname.startsWith('/signup');
  const hideChrome = isAdminRoute || isAuthRoute;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}> 
        <Providers >
        {hideChrome ? (
          <>
            {children}
            <Toaster position="top-right" />
          </>
        ) : (
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: { background: '#0E0E0F', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
                success: { duration: 3000, iconTheme: { primary: '#C9A961', secondary: '#0E0E0F' } },
                error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </div>
        )}
        </Providers>
      </body>
    </html>
  );
}