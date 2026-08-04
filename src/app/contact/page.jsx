"use client";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPaperPlane,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm">
          Contact Us
        </span>

        <h1 className="text-5xl md:text-6xl font-bold mt-6">
          We'd Love To Hear From You
        </h1>

        <p className="text-gray-400 max-w-3xl mx-auto mt-6 text-lg leading-8">
          Whether you're buying your dream car, selling your vehicle, or need
          assistance with our marketplace, our team is always here to help.
        </p>
      </div>

      {/* Contact */}
      <div className="max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-10">

        {/* Left */}
        <div className="space-y-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center">
                <FaPhoneAlt className="text-blue-500 text-xl" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">Phone</h3>
                <p className="text-gray-400 mt-1">
                  +880 1712-345678
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 transition">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                <FaEnvelope className="text-green-500 text-xl" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">Email</h3>
                <p className="text-gray-400 mt-1">
                  support@carsawari.com
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-red-500 transition">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                <FaMapMarkerAlt className="text-red-500 text-xl" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">Office</h3>
                <p className="text-gray-400 mt-1">
                  Sylhet, Bangladesh
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-yellow-500 transition">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <FaClock className="text-yellow-500 text-xl" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">Business Hours</h3>
                <p className="text-gray-400 mt-1">
                  Monday - Saturday
                </p>
                <p className="text-gray-500">
                  9:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="pt-4">
            <h3 className="text-xl font-semibold mb-5">
              Follow Us
            </h3>

            <div className="flex gap-4">

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-blue-500 flex items-center justify-center transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-pink-500 flex items-center justify-center transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-sky-500 flex items-center justify-center transition"
              >
                <FaLinkedinIn />
              </a>

            </div>
          </div>

        </div>

        {/* Right */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <h2 className="text-3xl font-bold mb-2">
            Send Us a Message
          </h2>

          <p className="text-gray-400 mb-8">
            Fill out the form below and our support team will contact you as soon
            as possible.
          </p>

          <form className="space-y-6">

            <div className="grid md:grid-cols-2 gap-5">

              <input
                type="text"
                placeholder="Your Name"
                className="bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
              />

            </div>

            <input
              type="text"
              placeholder="Subject"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
            />

            <textarea
              rows="6"
              placeholder="Write your message..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500 resize-none"
            ></textarea>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-4 font-semibold flex justify-center items-center gap-3"
            >
              <FaPaperPlane />
              Send Message
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}