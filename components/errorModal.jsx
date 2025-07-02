// components/ErrorModal.jsx
import React from 'react';

const ErrorModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4" 
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.1)" }}
    >
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
        <div className="bg-red-500 p-4 rounded-t-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;