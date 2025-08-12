import mongoose from "mongoose";

const CostPricesSchema = new mongoose.Schema({
  classic: { type: Number, default: 130 },
  double: { type: Number, default: 165 },
  hazelnut: { type: Number, default: 160 },
  redVelvet: { type: Number, default: 125 },
  cookiesAndCream: { type: Number, default: 180 },
  peanutButter: { type: Number, default: 170 },
  walnut: { type: Number, default: 160 },
  kunafa: { type: Number, default: 250 },
  updatedAt: { type: Date, default: Date.now }
});

const DailyExpensesSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  marketing: { type: Number, default: 0 },
  otherExpenses: { type: Number, default: 0 },
  dayEndProfit: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
DailyExpensesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const CostPrices = mongoose.models.CostPrices || mongoose.model("CostPrices", CostPricesSchema);
export const DailyExpenses = mongoose.models.DailyExpenses || mongoose.model("DailyExpenses", DailyExpensesSchema);
