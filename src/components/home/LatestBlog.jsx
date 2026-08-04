'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt, FaUser } from 'react-icons/fa';

export default function LatestBlog() {
  const blogs = [
    {
      id: 1,
      title: 'Top 10 SUVs to Buy in 2024 for Family Road Trips',
      excerpt: 'Discover the most spacious, reliable, and fuel-efficient SUVs perfect for your next family adventure.',
      category: 'Reviews',
      date: 'Aug 12, 2024',
      author: 'Alex Carter',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Electric vs. Hybrid: Which Should You Choose?',
      excerpt: 'A comprehensive guide to help you decide whether an electric vehicle or a hybrid is the right choice for your lifestyle.',
      category: 'Guides',
      date: 'Aug 10, 2024',
      author: 'Sarah Jenkins',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'How to Maximize Your Car\'s Resale Value',
      excerpt: 'Simple maintenance tips and tricks that can significantly increase what you get when it\'s time to sell your vehicle.',
      category: 'Tips',
      date: 'Aug 05, 2024',
      author: 'Michael Torres',
      image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-600 text-sm font-bold tracking-wider uppercase mb-4 border border-primary-100">
              Latest Insights
            </span>
            <h2 className="text-4xl md:text-5xl font-black font-display text-gray-900 tracking-tight">
              News & Articles
            </h2>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors group">
            View All Posts
            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-lg transition-all duration-500">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gray-900">
                  {blog.category}
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-3">
                  <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-primary-500" /> {blog.date}</span>
                  <span className="flex items-center gap-1.5"><FaUser className="text-primary-500" /> {blog.author}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-display group-hover:text-primary-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Read Article <FaArrowRight className="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
