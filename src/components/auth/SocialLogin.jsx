'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Social login buttons — Google, Facebook, Apple
 * @param {string} callbackUrl - URL to redirect to after login
 */
export default function SocialLogin({ callbackUrl = '/profile' }) {
  const handleLogin = async (provider) => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  const providers = [
    { id: 'google', label: 'Google', icon: FaGoogle, color: 'text-red-600' },
    { id: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
    { id: 'apple', label: 'Apple', icon: FaApple, color: 'text-gray-900' },
  ];

  return (
    <div className="space-y-3">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {providers.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => handleLogin(id)}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
            aria-label={`Sign in with ${label}`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
