'use client';

import Link from 'next/link';
import { FaCalculator, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

export default function FinancingBanner() {
  return (
    <section className="py-12 bg-white relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-primary-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/90 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/30 to-transparent blur-3xl"></div>

          <div className="relative z-10 px-8 py-16 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                <FaCalculator className="w-4 h-4 text-primary-300" />
                <span className="text-sm font-bold tracking-wider uppercase text-primary-100">Flexible Financing</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black font-display mb-6 leading-tight">
                Get Pre-Approved for Your Dream Car <span className="text-primary-400">in Minutes</span>
              </h2>
              
              <p className="text-lg text-primary-100 mb-8 max-w-xl">
                Competitive rates starting at 4.99% APR. No impact on your credit score to check your eligibility.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/financing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-900 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg shadow-white/10 active:scale-95 group">
                  Apply Now
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/emi-calculator" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-800/50 backdrop-blur-sm border border-primary-500/30 text-white rounded-xl font-bold hover:bg-primary-700/50 transition-colors">
                  EMI Calculator
                </Link>
              </div>
            </div>

            <div className="hidden lg:block bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl w-full max-w-sm">
               <h3 className="text-xl font-bold text-white mb-6 font-display">Why finance with us?</h3>
               <ul className="space-y-4">
                 {[
                   'Instant approval decisions',
                   'Competitive interest rates',
                   'Flexible loan terms up to 84 months',
                   'Zero down payment options',
                 ].map((benefit, index) => (
                   <li key={index} className="flex items-start gap-3">
                     <FaCheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                     <span className="text-primary-100 font-medium">{benefit}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
