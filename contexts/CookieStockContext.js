"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CookieStockContext = createContext();

export const CookieStockProvider = ({ children }) => {
  const [stockStatus, setStockStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cookie-stock');
      const result = await response.json();
      
      if (result.success) {
        // Convert array to object for easier lookup
        const stockMap = result.data.reduce((acc, item) => {
          acc[item.cookieName] = item.isOutOfStock;
          return acc;
        }, {});
        setStockStatus(stockMap);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch stock status');
      }
    } catch (err) {
      setError('Failed to fetch stock status');
      console.error('Stock fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockStatus();
  }, []);

  const isOutOfStock = (cookieName) => {
    return stockStatus[cookieName] || false;
  };

  const refreshStock = () => {
    fetchStockStatus();
  };

  const value = {
    stockStatus,
    loading,
    error,
    isOutOfStock,
    refreshStock
  };

  return (
    <CookieStockContext.Provider value={value}>
      {children}
    </CookieStockContext.Provider>
  );
};

export const useCookieStock = () => {
  const context = useContext(CookieStockContext);
  if (!context) {
    throw new Error('useCookieStock must be used within a CookieStockProvider');
  }
  return context;
};
