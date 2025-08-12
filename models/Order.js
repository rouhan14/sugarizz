import mongoose from "mongoose";

const CookieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  title: { type: String }
});

const VoucherSchema = new mongoose.Schema({
  code: { type: String },
  discount: { type: Number },
  discountAmount: { type: Number }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: Number, required: true, unique: true }, // 1001, 1002, ...
  name: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String, required: true },
  userInputAddress: { type: String, required: true }, // Address entered by user
  resolvedAddress: { type: String }, // Address calculated from GPS/geocoding
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  cookies: { type: [CookieSchema], required: true },
  deliveryZone: { type: String, required: true },
  deliveryCharges: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
  paymentDiscount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  appliedVoucher: { type: VoucherSchema, default: null },
  voucherDiscount: { type: Number, default: 0 },
  finalPriceWithVoucher: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // Total including cookies + delivery
  estimatedDeliveryTime: { type: String },
  eta: { type: String },
  distanceFromStore: { type: Number },
  orderTime: { type: String },
  additionalRecommendations: { type: String },
  
  // Additional admin fields for manual calculations
  riderPayment: { type: Number, default: 0 }, // Amount paid to rider for delivery
  materialPackagingCost: { type: Number, default: 0 }, // Calculated from cookie quantities
  revenue: { type: Number, default: 0 }, // Total price minus rider payment
  grossProfit: { type: Number, default: 0 }, // Revenue after rider payment - material costs
  adminNotes: { type: String, default: '' }, // Admin notes
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
