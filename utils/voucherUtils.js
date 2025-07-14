// voucherUtils.js - Utility functions for voucher operations

import vouchers from '@/data/vouchers';

/**
 * Validates a voucher code and returns validation result
 * @param {string} code - The voucher code to validate
 * @param {number} orderAmount - The current order amount
 * @returns {Object} Validation result with success, voucher, and message
 */
export const validateVoucher = (code, orderAmount) => {
  if (!code || !code.trim()) {
    return {
      success: false,
      voucher: null,
      message: "Please enter a voucher code"
    };
  }

  const voucher = vouchers.find(v => v.code.toLowerCase() === code.toLowerCase());

  if (!voucher) {
    return {
      success: false,
      voucher: null,
      message: "Invalid voucher code"
    };
  }

  if (!voucher.isActive) {
    return {
      success: false,
      voucher: null,
      message: "This voucher has expired or is inactive"
    };
  }

  // Check expiry date
  const currentDate = new Date();
  const expiryDate = new Date(voucher.expiryDate);
  if (currentDate > expiryDate) {
    return {
      success: false,
      voucher: null,
      message: "This voucher has expired"
    };
  }

  // Check usage limit
  if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
    return {
      success: false,
      voucher: null,
      message: "This voucher has reached its usage limit"
    };
  }

  // Check minimum order requirement
  if (orderAmount < voucher.minimumOrder) {
    return {
      success: false,
      voucher: null,
      message: `Minimum order of Rs. ${voucher.minimumOrder.toLocaleString()} required for this voucher`
    };
  }

  return {
    success: true,
    voucher,
    message: `Voucher applied! ${voucher.discount}% discount`
  };
};

/**
 * Calculates the discount amount based on voucher and order amount
 * @param {Object} voucher - The voucher object
 * @param {number} orderAmount - The order amount to calculate discount on
 * @returns {number} The discount amount
 */
export const calculateVoucherDiscount = (voucher, orderAmount) => {
  if (!voucher) return 0;
  return Math.round((orderAmount * voucher.discount) / 100);
};

/**
 * Gets all available vouchers for display
 * @returns {Array} Array of active vouchers
 */
export const getAvailableVouchers = () => {
  return vouchers.filter(voucher => voucher.isActive);
};