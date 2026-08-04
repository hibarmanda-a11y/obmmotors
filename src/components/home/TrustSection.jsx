'use client';

import { FaShieldAlt, FaRegCheckCircle, FaUsers, FaAward } from 'react-icons/fa';
import { Card } from '@/components/ui/Card';

const trustItems = [
  {
    icon: FaShieldAlt,
    title: 'Buyer Protection',
    description: 'Every purchase is secured and protected by our comprehensive warranty program.',
  },
  {
    icon: FaRegCheckCircle,
    title: 'Verified Dealers',
    description: 'We rigorously vet all our dealers to ensure you get the highest quality service.',
  },
  {
    icon: FaUsers,
    title: '8,500+ Customers',
    description: 'Join thousands of satisfied customers who found their dream car with us.',
  },
  {
    icon: FaAward,
    title: 'Award Winning',
    description: 'Recognized as the #1 Premium Car Marketplace for three consecutive years.',
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-surface border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Why Choose CarVault?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We provide a transparent, secure, and premium car buying experience from start to finish.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="p-8 text-center bg-gray-50/50 hover:bg-white transition-colors duration-300">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6 text-primary-600">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
