"use client";

import {
  FaShieldAlt,
  FaCar,
  FaDollarSign,
  FaUsers,
  FaBullseye,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt className="w-8 h-8 text-blue-500" />,
    title: "Verified Listings",
    desc: "Every vehicle is carefully reviewed to ensure authenticity and quality.",
  },
  {
    icon: <FaCar className="w-8 h-8 text-red-500" />,
    title: "Premium Cars",
    desc: "Browse thousands of new and used vehicles from trusted sellers.",
  },
  {
    icon: <FaDollarSign className="w-8 h-8 text-green-500" />,
    title: "Affordable Pricing",
    desc: "Transparent pricing with financing and financing options available.",
  },
  {
    icon: <FaUsers className="w-8 h-8 text-purple-500" />,
    title: "Trusted Community",
    desc: "Thousands of happy customers and verified dealerships worldwide.",
  },
];

const stats = [
  {
    number: "1,200+",
    title: "Cars Available",
  },
  {
    number: "8,500+",
    title: "Happy Customers",
  },
  {
    number: "350+",
    title: "Verified Dealers",
  },
  {
    number: "4.9★",
    title: "Customer Rating",
  },
];

export default function AboutPage() {
  return (
    <section className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
          About Car Sawari
        </span>

        <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
          Driving The Future Of{" "}
          <span className="text-blue-500">Car Buying</span> & Selling
        </h1>

        <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg leading-8">
          Car Sawari is a trusted online marketplace designed to connect buyers
          and sellers through a secure, transparent, and premium vehicle buying
          experience.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 pb-20">
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500 transition">
          <FaBullseye className="w-10 h-10 text-blue-500 mb-5" />

          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>

          <p className="text-gray-400 leading-8">
            Our mission is to simplify the car buying and selling process by
            providing a trusted marketplace where customers can confidently
            discover, compare, and purchase quality vehicles.
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-purple-500 transition">
          <FaEye className="w-10 h-10 text-purple-500 mb-5" />

          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>

          <p className="text-gray-400 leading-8">
            We envision becoming one of the world's most trusted digital
            automotive marketplaces by delivering innovation, transparency, and
            outstanding customer service.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            Why Choose <span className="text-blue-500">Car Sawari</span>
          </h2>

          <p className="text-gray-400 mt-4">
            Everything you need for a secure and premium car marketplace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >
              {item.icon}

              <h3 className="text-xl font-semibold mt-5">{item.title}</h3>

              <p className="text-gray-400 mt-3 leading-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((item, index) => (
              <div key={index}>
                <h2 className="text-5xl font-bold text-blue-500">
                  {item.number}
                </h2>

                <p className="text-gray-400 mt-3">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            Our <span className="text-blue-500">Core Values</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            "Customer First",
            "Trusted Transactions",
            "Innovation",
            "Transparency",
            "Quality Service",
            "Continuous Improvement",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 bg-slate-900 rounded-xl border border-slate-800 p-5 hover:border-blue-500 transition"
            >
              <FaCheckCircle className="text-green-500 w-6 h-6" />

              <span className="text-lg">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold">
            Ready To Find Your Dream Car?
          </h2>

          <p className="mt-6 text-blue-100 text-lg leading-8">
            Explore thousands of premium vehicles or list your own car today.
            Join thousands of satisfied customers who trust Car Sawari.
          </p>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              Browse Cars
            </button>

            <button className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
              Sell Your Car
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}