import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompareBar from '@/components/ui/CompareBar';
import { Providers } from './(Providers)/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CarVault - Premium Car Selling Platform',
  description: 'Find your dream car with the best deals and financing options',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface text-gray-900 antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className='mt-20'></div>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <CompareBar />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}