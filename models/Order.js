import mongoose from "mongoose";

const CookieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }, // number of cookies ordered
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: Number, required: true, unique: true }, // 1001, 1002, ...
  name: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  cookies: { type: [CookieSchema], required: true },
  deliveryZone: { type: String, required: true },
  deliveryCharges: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // Total including cookies + delivery
  additionalRecommendations: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
