import mongoose from "mongoose";

const CookieStockSchema = new mongoose.Schema({
  cookieName: { 
    type: String, 
    required: true, 
    unique: true 
  },
  isOutOfStock: { 
    type: Boolean, 
    default: false 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  updatedBy: { 
    type: String, 
    default: 'admin' 
  }
}, {
  timestamps: true
});

// Create an index on cookieName for faster queries
CookieStockSchema.index({ cookieName: 1 });

export default mongoose.models.CookieStock || mongoose.model("CookieStock", CookieStockSchema);
