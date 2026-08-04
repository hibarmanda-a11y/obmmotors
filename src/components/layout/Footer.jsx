import Link from 'next/link';
import Image from 'next/image';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaCar,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';

/**
 * Footer component with company info, links, and social media
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { href: '/buy', label: 'Buy Cars' },
      { href: '/sell', label: 'Sell Your Car' },
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
    ],
    'Support': [
      { href: '/faq', label: 'FAQ' },
      { href: '/terms', label: 'Terms & Conditions' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/returns', label: 'Returns Policy' },
    ],
    'Contact': [
      { icon: FaPhone, text: '+1 (555) 123-4567' },
      { icon: FaEnvelope, text: 'info@carvault.com' },
      { icon: FaMapMarkerAlt, text: '123 Auto Plaza, New York, NY 10001' },
    ],
  };

  const socialLinks = [
    { href: 'https://facebook.com', icon: FaFacebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: FaTwitter, label: 'Twitter' },
    { href: 'https://instagram.com', icon: FaInstagram, label: 'Instagram' },
    { href: 'https://linkedin.com', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://youtube.com', icon: FaYoutube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <FaCar className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">CarVault</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your trusted platform for buying and selling premium cars. 
              Find your dream car with the best deals and financing options.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition-all duration-200 text-gray-400 hover:text-white"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks['Quick Links'].map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks['Support'].map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get In Touch</h3>
            <ul className="space-y-3">
              {footerLinks['Contact'].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center space-x-3 text-gray-400">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">
                Mon - Fri: 9:00 AM - 6:00 PM
              </p>
              <p className="text-gray-400 text-sm">
                Sat - Sun: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} CarVault. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}