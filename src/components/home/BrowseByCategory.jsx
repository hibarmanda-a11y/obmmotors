'use client';

import Link from 'next/link';
import { FaCarSide, FaTruck, FaLeaf, FaBolt } from 'react-icons/fa';
import { Card, CardBody } from '@/components/ui/Card';

const categories = [
  { id: 'suv', name: 'SUV', icon: FaTruck, href: '/buy?category=SUV' },
  { id: 'sedan', name: 'Sedan', icon: FaCarSide, href: '/buy?category=Sedan' },
  { id: 'ev', name: 'Electric', icon: FaBolt, href: '/buy?category=EV' },
  { id: 'hybrid', name: 'Hybrid', icon: FaLeaf, href: '/buy?category=Hybrid' },
  { id: 'coupe', name: 'Coupe', icon: FaCarSide, href: '/buy?category=Coupe' },
];

export default function BrowseByCategory() {
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Find the perfect vehicle that fits your lifestyle. From spacious SUVs to eco-friendly Electric cars.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={category.href}>
                <Card hover className="h-full flex flex-col items-center justify-center p-6 cursor-pointer group">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
