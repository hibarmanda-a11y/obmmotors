'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  FaHeart, 
  FaShare, 
  FaArrowLeft, 
  FaCar, 
  FaCalendar, 
  FaTachometerAlt, 
  FaGasPump,
  FaCogs,
  FaUsers,
  FaDoorOpen,
  FaRoad,
  FaCheckCircle,
  FaCreditCard,
  FaCalculator,
  FaEnvelope,
  FaPhone,
  FaExclamationTriangle,
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLink
} from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Car Details Page - Shows detailed information about a specific car
 * Fetches data from MongoDB API
 */
export default function CarDetailsPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [emiDetails, setEmiDetails] = useState(null);
  const [emiInput, setEmiInput] = useState({
    downPayment: 20,
    tenure: 60,
  });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
    setShowShareMenu(false);
  };

  // Fetch car details from API
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Car not found');
          }
          throw new Error('Failed to fetch car details');
        }
        
        const data = await response.json();
        setCar(data.car);
        
        // Calculate EMI if emiOptions exist
        if (data.car?.emiOptions) {
          calculateEMI(data.car);
        }
      } catch (error) {
        console.error('Error fetching car:', error);
        setError(error.message);
        toast.error(error.message || 'Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCar();
    }
  }, [params.id]);

  // Calculate EMI
  const calculateEMI = (carData) => {
    if (!carData) return;
    
    const price = carData.price;
    const downPaymentPercent = emiInput.downPayment;
    const tenure = emiInput.tenure;
    const interestRate = carData.emiOptions?.interestRate || 5;
    
    const downPayment = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const months = tenure;
    
    let monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / months;
    } else {
      monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                      (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;
    
    setEmiDetails({
      downPayment,
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    });
  };

  // Update EMI when inputs change
  useEffect(() => {
    if (car) {
      calculateEMI(car);
    }
  }, [emiInput, car]);

  // Handle buy now
  const handleBuyNow = async () => {
    if (!session) {
      toast.error('Please login to purchase');
      return;
    }

    try {
      // Call your API to process purchase
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car._id,
          paymentType: 'full',
        }),
      });

      if (!response.ok) throw new Error('Purchase failed');
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to place order');
    }
  };

  // Handle EMI purchase
  const handleEMIPurchase = async () => {
    if (!session) {
      toast.error('Please login to purchase with EMI');
      return;
    }

    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car._id,
          paymentType: 'emi',
          emiDetails: {
            downPayment: emiDetails.downPayment,
            tenure: emiInput.tenure,
            monthlyPayment: emiDetails.monthlyPayment,
            interestRate: car.emiOptions.interestRate,
          },
        }),
      });

      if (!response.ok) throw new Error('EMI purchase failed');
      
      toast.success('EMI plan selected successfully!');
    } catch (error) {
      console.error('EMI purchase error:', error);
      toast.error('Failed to process EMI');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <FaExclamationTriangle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">{error}</h1>
          <p className="text-gray-500 mb-4">The car you're looking for might have been removed</p>
          <Link 
            href="/buy" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Back to search</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Car not found</h1>
          <Link href="/buy" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 font-sans">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link
          href="/buy"
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-primary-600 font-medium transition-colors duration-200 mb-8 group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Inventory</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Images */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image */}
            <div className="relative h-[500px] bg-gray-100 rounded-[2rem] overflow-hidden shadow-soft group">
              {car.images && car.images.length > 0 && (
                <Image
                  src={car.images[currentImageIndex] || car.images[0]}
                  alt={car.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              )}
              {/* Image Navigation Dots */}
              {car.images && car.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                  {car.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'w-6 bg-white shadow-lg'
                          : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'border-primary-600 shadow-md transform scale-[1.02]'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:shadow-soft'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${car.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Features list - moved to left column for better layout flow */}
            {car.features && car.features.length > 0 && (
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-display">Premium Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100 transition-all hover:bg-white hover:shadow-soft">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                        <FaCheckCircle className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">Vehicle Overview</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{car.description}</p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Title and Price Sticky Header */}
            <div className="bg-white rounded-[2rem] p-8 shadow-float border border-gray-100 relative">
              <div className="absolute -top-4 -right-4 flex space-x-2">
                <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300 border border-gray-100">
                  <FaHeart className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:scale-110 transition-all duration-300 border border-gray-100"
                  >
                    <FaShare className="w-5 h-5" />
                  </button>
                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-float border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={copyToClipboard} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <FaLink className="text-gray-400" /> Copy Link
                      </button>
                      <a href={`https://wa.me/?text=Check out this ${car.title} ${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <FaWhatsapp className="text-green-500" /> WhatsApp
                      </a>
                      <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this ${car.title}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <FaTwitter className="text-blue-400" /> Twitter
                      </a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <FaFacebook className="text-blue-600" /> Facebook
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 ${
                  car.status === 'available'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {car.status === 'available' ? 'Available Now' : 'Sold Out'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 font-display leading-tight">
                  {car.title}
                </h1>
              </div>

              <div className="pt-4 border-t border-gray-100 mb-6">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">List Price</p>
                <span className="text-4xl font-black text-primary-600">
                  {formatPrice(car.price)}
                </span>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary-600">
                    <FaCalendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Year</p>
                    <p className="font-bold text-gray-900">{car.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary-600">
                    <FaTachometerAlt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Mileage</p>
                    <p className="font-bold text-gray-900">{car.mileage.toLocaleString()} mi</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary-600">
                    <FaGasPump className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Fuel Type</p>
                    <p className="font-bold text-gray-900">{car.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary-600">
                    <FaCogs className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Transmission</p>
                    <p className="font-bold text-gray-900">{car.transmission}</p>
                  </div>
                </div>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={car.status !== 'available'}
                className={`w-full py-4 px-6 text-white font-bold rounded-xl transition-all duration-300 shadow-lg ${
                  car.status === 'available'
                    ? 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/30 active:scale-[0.98]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                <div className="flex items-center justify-center space-x-2 text-lg">
                  <FaCreditCard className="w-5 h-5" />
                  <span>Purchase Vehicle</span>
                </div>
              </button>
            </div>

            {/* Seller Information */}
            {car.seller && (
              <div className="bg-white rounded-[2rem] p-8 shadow-soft border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">Dealer Information</h3>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                    <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(car.seller.name || 'Dealer')}&background=eff6ff&color=2563eb`} alt="Dealer" width={64} height={64} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{car.seller.name || 'Premium Dealer'}</h4>
                    <p className="text-green-600 text-sm font-medium flex items-center"><FaCheckCircle className="mr-1"/> Verified Seller</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <a href={`mailto:${car.seller.email}`} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <FaEnvelope className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-primary-600">{car.seller.email || 'Contact via email'}</span>
                  </a>
                  <a href={`tel:${car.seller.phone}`} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <FaPhone className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-primary-600">{car.seller.phone || 'Call dealer'}</span>
                  </a>
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400">
                      <FaRoad className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium">{car.seller.address || 'Location on request'}</span>
                  </div>
                </div>
                
                
                <button className="w-full py-3 bg-surface border-2 border-primary-600 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors mb-3">
                  Send Message
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowTestDriveModal(true)} className="py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <FaCar /> Test Drive
                  </button>
                  <button onClick={() => setShowVisitModal(true)} className="py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <FaRegCalendarAlt /> Schedule Visit
                  </button>
                </div>
              </div>
            )}

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={car.status !== 'available'}
              className={`w-full py-4 text-white font-semibold rounded-2xl transition-all duration-200 ${
                car.status === 'available'
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaCreditCard className="w-5 h-5" />
                <span>Buy Now - {formatPrice(car.price)}</span>
              </div>
            </button>

            {/* EMI Section */}
            {car.emiOptions && (
              <div className="border-2 border-blue-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <FaCalculator className="text-blue-600" />
                  <span>EMI Calculator</span>
                </h3>

                {/* EMI Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Down Payment: {emiInput.downPayment}%
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={emiInput.downPayment}
                      onChange={(e) => setEmiInput({
                        ...emiInput,
                        downPayment: parseInt(e.target.value),
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Tenure: {emiInput.tenure} months
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="84"
                      step="12"
                      value={emiInput.tenure}
                      onChange={(e) => setEmiInput({
                        ...emiInput,
                        tenure: parseInt(e.target.value),
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                {/* EMI Details */}
                {emiDetails && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-600">Down Payment</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(emiDetails.downPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Loan Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(emiDetails.loanAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Payment</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatPrice(emiDetails.monthlyPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Interest</p>
                      <p className="text-lg font-semibold text-orange-600">
                        {formatPrice(emiDetails.totalInterest)}
                      </p>
                    </div>
                  </div>
                )}

                {/* EMI Buy Button */}
                <button
                  onClick={handleEMIPurchase}
                  disabled={car.status !== 'available'}
                  className={`w-full py-3 text-white font-semibold rounded-xl transition-all duration-200 ${
                    car.status === 'available'
                      ? 'bg-green-600 hover:bg-green-700 active:scale-95'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Buy with EMI</span>
                    <span className="text-sm opacity-80">
                      ({formatPrice(emiDetails?.monthlyPayment || 0)}/mo)
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTestDriveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowTestDriveModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
              <FaTimes className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold font-display mb-2">Book a Test Drive</h3>
            <p className="text-gray-500 mb-6">Experience the {car.title} firsthand.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Test drive requested!'); setShowTestDriveModal(false); }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Date</label>
                <input type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Time</label>
                <select required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all">
                  <option value="">Select a time slot</option>
                  <option value="morning">Morning (9AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 4PM)</option>
                  <option value="evening">Evening (4PM - 7PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Number</label>
                <input type="tel" required placeholder="(555) 000-0000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors mt-2">
                Request Test Drive
              </button>
            </form>
          </div>
        </div>
      )}

      {showVisitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowVisitModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
              <FaTimes className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold font-display mb-2">Schedule Dealership Visit</h3>
            <p className="text-gray-500 mb-6">Meet our team and see the {car.title} in person.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Visit scheduled!'); setShowVisitModal(false); }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Date</label>
                <input type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Time</label>
                <input type="time" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors mt-2">
                Confirm Visit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}