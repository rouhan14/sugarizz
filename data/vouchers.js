const vouchers = [
  {
    code: "eman93245",
    name: "Welcome Discount",
    description: "20% off",
    discount: 20, // percentage
    minimumOrder: 1200,
    isActive: true,
    expiryDate: "2026-12-31",
    usageLimit: null, // null means unlimited
    usedCount: 0
  },
];

export default vouchers;