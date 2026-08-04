'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaFilter, FaTimes, FaArrowRight, FaHeart, FaCar, FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';
import RecentlyViewed from '@/components/home/RecentlyViewed';

export default function BuyPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    make: '',
    priceRange: '',
    condition: '',
    fuelType: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [totalCars, setTotalCars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(9);
  const [viewMode, setViewMode] = useState('grid');

  // Logic untouched
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filters.make && filters.make !== 'All Makes') params.append('make', filters.make);
        if (filters.condition && filters.condition !== 'All Conditions') params.append('condition', filters.condition);
        if (filters.fuelType && filters.fuelType !== 'All Fuel Types') params.append('fuelType', filters.fuelType);
        if (filters.priceRange && filters.priceRange !== 'All Prices') params.append('priceRange', filters.priceRange);
        if (sortBy) params.append('sort', sortBy);
        params.append('limit', itemsPerPage.toString());
        params.append('page', currentPage.toString());

        const response = await fetch(`/api/cars?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch cars');
        const data = await response.json();
        setCars(data.cars || []);
        setTotalCars(data.pagination?.total || 0);
        setTotalPages(data.pagination?.pages || 1);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
        setTotalCars(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchCars, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filters, sortBy, currentPage, itemsPerPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filters, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const clearFilters = () => {
    setFilters({ make: '', priceRange: '', condition: '', fuelType: '' });
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const goToPage = (page) => { if (page >= 1 && page <= totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const goToPreviousPage = () => { if (currentPage > 1) goToPage(currentPage - 1); };
  const goToNextPage = () => { if (currentPage < totalPages) goToPage(currentPage + 1); };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) { for (let i = 1; i <= totalPages; i++) pageNumbers.push(i); }
    else {
      pageNumbers.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (start > 2) pageNumbers.push('...');
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (end < totalPages - 1) pageNumbers.push('...');
      if (totalPages > 1) pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const filterOptions = {
    makes: ['All Makes', 'Mercedes-Benz', 'Porsche', 'BMW', 'Audi', 'Lucid', 'Tesla', 'Lamborghini', 'Chevrolet', 'Hyundai', 'Ford', 'Toyota', 'Nissan'],
    conditions: ['All Conditions', 'New', 'Used', 'Certified Pre-Owned'],
    fuelTypes: ['All Fuel Types', 'Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
    priceRanges: ['All Prices', 'Under $50,000', '$50,000-$100,000', '$100,000-$200,000', 'Over $200,000'],
  };

  // DARK SKELETON
  if (loading) {
    return (
      <div className="min-h-screen bg-[#060714] py-12">
        <div className="container mx-auto px-6">
          <div className="mb-12 animate-pulse space-y-4">
            <div className="h-12 w-64 bg-white/10 rounded-xl"></div>
            <div className="h-4 w-96 bg-white/5 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden h-[450px]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060714] py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5842f1]/10 blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] -z-10"></div>

      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Find Your <span className="text-[#5842f1]">Dream Car</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Browse through our curated collection of premium vehicles from the world's most prestigious brands.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 mb-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#5842f1] transition-colors" />
              <input
                type="text"
                placeholder="Search by make, model, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#5842f1] focus:bg-white/[0.08] transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#5842f1] transition-all cursor-pointer"
            >
              <option value="newest" className="bg-[#060714]">Newest Arrival</option>
              <option value="price-low" className="bg-[#060714]">Price: Low to High</option>
              <option value="price-high" className="bg-[#060714]">Price: High to Low</option>
              <option value="popular" className="bg-[#060714]">Most Popular</option>
            </select>

            <div className="flex space-x-4">
              {/* View Toggles */}
              <div className="hidden lg:flex bg-white/5 border border-white/10 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'grid' ? 'bg-[#5842f1] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title="Grid View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === 'list' ? 'bg-[#5842f1] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title="List View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all flex-1 lg:flex-none ${
                  showFilters ? 'bg-[#5842f1] text-white shadow-[0_0_20px_rgba(88,66,241,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FaFilter className="w-4 h-4" />
                <span>{showFilters ? 'Close Filters' : 'Filters'}</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { key: 'make', label: 'Make', options: filterOptions.makes },
                  { key: 'priceRange', label: 'Price', options: filterOptions.priceRanges },
                  { key: 'condition', label: 'Condition', options: filterOptions.conditions },
                  { key: 'fuelType', label: 'Fuel', options: filterOptions.fuelTypes }
                ].map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{filter.label}</label>
                    <select
                      value={filters[filter.key]}
                      onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#5842f1] transition-all"
                    >
                      {filter.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#060714]">{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Clear Filters */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors py-2 px-4 rounded-lg hover:bg-red-400/10"
                >
                  <FaTimes className="w-3 h-3" />
                  <span className="text-sm font-medium">Reset All Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Metadata */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400">
          <p className="text-sm">
            Showing <span className="text-white font-bold">{cars.length}</span> of <span className="text-white font-bold">{totalCars}</span> exclusive vehicles
          </p>
          <div className="h-[1px] flex-1 bg-white/5 hidden sm:block mx-8" />
          <p className="text-xs uppercase tracking-widest font-bold">
            Page {currentPage} / {totalPages}
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
              {cars.map((car) => (
                <div
                  key={car._id}
                  className={`group bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 overflow-hidden flex ${viewMode === 'list' ? 'flex-col md:flex-row' : 'flex-col'}`}
                >
                  {/* Image Container */}
                  <div className={`relative overflow-hidden m-3 rounded-[2rem] ${viewMode === 'list' ? 'md:w-2/5 md:h-auto' : ''}`}>
                    <Link href={`/buy/${car._id}`}>
                      <div className={`relative w-full bg-white/5 ${viewMode === 'list' ? 'h-64 md:h-full min-h-[250px]' : 'h-64'}`}>
                        {car.images && car.images.length > 0 && (
                          <Image
                            src={car.images[0]}
                            alt={car.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        )}
                      </div>
                    </Link>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {car.condition === 'New' && (
                          <span className="px-4 py-1.5 bg-[#5842f1]/20 backdrop-blur-md text-[#8c7dfa] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#5842f1]/30">
                            Brand New
                          </span>
                        )}
                        {car.status === 'available' && (
                          <span className="px-4 py-1.5 bg-green-500/20 backdrop-blur-md text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/30">
                            In Stock
                          </span>
                        )}
                    </div>

                    <button className="absolute top-4 right-4 w-11 h-11 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-red-500 hover:bg-white/10 transition-all duration-300">
                      <FaHeart className="w-5 h-5" />
                    </button>
                  </div>

                  <div className={`p-8 pt-4 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-center' : ''}`}>
                    <Link href={`/buy/${car._id}`}>
                      <h3 className="text-2xl font-bold text-white hover:text-[#5842f1] transition-colors duration-300 mb-2 truncate">
                        {car.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mb-6 font-medium">
                      <span className="flex items-center gap-1.5"><FaClock className="w-3 h-3 text-[#5842f1]"/> {car.year}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                      <span>{car.fuelType}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                      <span>{car.mileage?.toLocaleString() || 0} mi</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">List Price</p>
                        <span className="text-3xl font-black text-white">
                            {formatPrice(car.price)}
                        </span>
                      </div>
                      
                      <Link
                        href={`/buy/${car._id}`}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#5842f1] hover:border-[#5842f1] transition-all duration-300 shadow-xl"
                      >
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center space-x-3">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
                    currentPage === 1
                      ? 'border-white/5 text-gray-700 cursor-not-allowed'
                      : 'border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? goToPage(page) : null}
                      className={`min-w-[48px] h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        page === currentPage
                          ? 'bg-[#5842f1] text-white shadow-lg'
                          : page === '...'
                          ? 'text-gray-500 cursor-default'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
                    currentPage === totalPages
                      ? 'border-white/5 text-gray-700 cursor-not-allowed'
                      : 'border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* No Results State */
          <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-500">
                <FaCar className="w-10 h-10" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No matching vehicles</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any cars matching your current criteria. Try adjusting your search or resetting the filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-10 py-4 bg-white text-black rounded-2xl font-black hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
            >
              Reset All Search Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Recently Viewed Cars */}
      <RecentlyViewed />
    </div>
  );
}