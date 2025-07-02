import mongoose from "mongoose";

const CookieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number, // Price per unit
    required: true,
  },
  quantity: {
    type: Number, // Number of cookies ordered
    required: true,
  },
});

export default CookieSchema;