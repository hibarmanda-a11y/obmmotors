'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaUpload, 
  FaTimes, 
  FaCar, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendar,
  FaTachometerAlt,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Sell Page - Allows users to list their car for sale
 * Users submit details and admin will contact them for inspection
 */
export default function SellPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorPhone: '',
    carMake: '',
    carModel: '',
    carYear: new Date().getFullYear(),
    carMileage: '',
    carCondition: 'Excellent',
    askingPrice: '',
    carDescription: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    additionalNotes: '',
  });

  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate session
    if (!session) {
      toast.error('Please login to sell your car');
      router.push('/login');
      return;
    }

    // Validate images
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      // Upload images to Cloudinary first
      const uploadedImages = [];
      for (const image of images) {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image }),
        });
        const data = await response.json();
        if (data.url) {
          uploadedImages.push(data.url);
        }
      }

      // Submit sell request
      const sellData = {
        ...formData,
        carImages: uploadedImages,
        userId: session.user.id,
      };

      const response = await fetch('/api/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellData),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      toast.success('Thank you! We will contact you soon for inspection');
      router.push('/');
    } catch (error) {
      console.error('Error submitting sell request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display text-gray-900">
            Sell Your <span className="text-primary-600">Premium Vehicle</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Get the best value for your car through our exclusive marketplace. Fill in the details below and our team will contact you for a professional appraisal.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2rem] shadow-float border border-gray-100 p-8 md:p-10 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-3xl rounded-full pointer-events-none"></div>
          
          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-3 text-gray-900 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                  <FaUser className="w-5 h-5" />
                </div>
                <span>Personal Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="authorEmail"
                      value={formData.authorEmail}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="authorPhone"
                      value={formData.authorPhone}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Car Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-3 text-gray-900 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                  <FaCar className="w-5 h-5" />
                </div>
                <span>Vehicle Specifications</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Make <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                    placeholder="e.g., Porsche"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                    placeholder="e.g., 911 Turbo S"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="carYear"
                    value={formData.carYear}
                    onChange={handleChange}
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                    placeholder="e.g., 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Mileage <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="carMileage"
                      value={formData.carMileage}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full pl-5 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                      placeholder="e.g., 15000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">mi</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="carCondition"
                    value={formData.carCondition}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900 cursor-pointer appearance-none"
                  >
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Asking Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      name="askingPrice"
                      value={formData.askingPrice}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full pl-8 pr-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900 text-lg font-bold"
                      placeholder="25000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Vehicle Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="carDescription"
                  value={formData.carDescription}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900 resize-none"
                  placeholder="Describe your vehicle's condition, features, packages, and maintenance history in detail..."
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-3 text-gray-900 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <span>Inspection Location</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                    placeholder="Enter street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900"
                    placeholder="ZIP"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-3 text-gray-900 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                  <FaUpload className="w-5 h-5" />
                </div>
                <span>Vehicle Images</span>
              </h2>
              
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300 ${
                  images.length > 0
                    ? 'border-primary-300 bg-primary-50/50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50 cursor-pointer'
                }`}
              >
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-white rounded-full shadow-soft flex items-center justify-center mb-6 text-primary-500">
                    <FaUpload className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop or Click to Upload</h3>
                  <p className="text-gray-500 max-w-sm">
                    Upload high-quality images of your vehicle's exterior, interior, and any notable features.
                  </p>
                  <div className="mt-6 flex space-x-4 text-sm font-medium">
                    <span className="px-3 py-1 bg-white rounded-full text-gray-600 border border-gray-200 shadow-sm">Max 5 images</span>
                    <span className="px-3 py-1 bg-white rounded-full text-gray-600 border border-gray-200 shadow-sm">Max 5MB each</span>
                  </div>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                  {images.map((image, index) => (
                    <div key={index} className="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-32 w-full bg-gray-100">
                        <Image
                          src={image}
                          alt={`Upload preview ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label htmlFor="imageUpload" className="h-32 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-primary-500">
                      <FaUpload className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Add More</span>
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center space-x-2">
                <FaInfoCircle className="text-primary-500" />
                <span>Additional Notes (Optional)</span>
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows="3"
                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-gray-900 resize-none"
                placeholder="Any special times to reach you or other information we should know..."
              />
            </div>

            {/* Submit Section */}
            <div className="pt-8 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-wait shadow-none'
                    : 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-600/40 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Submission...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <FaCheckCircle className="w-6 h-6" />
                    <span>Submit Vehicle for Appraisal</span>
                  </div>
                )}
              </button>

              <div className="mt-6 text-center text-gray-500 text-sm">
                <p>By submitting this form, you agree to our <a href="#" className="text-primary-600 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 font-medium hover:underline">Privacy Policy</a>.</p>
                <p className="mt-1">Our team will review your submission and contact you within 24 hours.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}