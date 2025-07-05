"use client"

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ThankyouDelivery from '@/components/thankyou/ThankyouDelivery';

const Page = () => {

  const searchParams = useSearchParams();
  const eta = searchParams.get('eta') || "45-60 minutes";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Success Icon */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-green-100">Thank you for your purchase</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🍪 Your delicious cookies are on the way!
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We've received your order and our bakers are already working their magic.
              You'll receive a confirmation call shortly with your order details.
            </p>
          </div>

          {/* Order Details Box */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Expected Delivery:</span>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <ThankyouDelivery />
              </Suspense>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold text-gray-800">Cash on Delivery</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
            >
              Continue Shopping
            </Link>

          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Need help with your order?</p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="mailto:sugarizz1000@gmail.com" className="text-blue-500 hover:text-blue-600">
                ✉️ Email
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-xs text-gray-500">
            Thank you for choosing SugaRizz! 🧡
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;