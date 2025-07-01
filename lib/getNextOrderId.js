import mongoose from "mongoose";
import dbConnect from "./mongoose";

// Create a separate counter schema
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // This will be "orderId"
  sequenceValue: { type: Number, default: 1000 }
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export async function getNextOrderId() {
  await dbConnect();
  
  try {
    // Find and update the counter, creating it if it doesn't exist
    const counter = await Counter.findOneAndUpdate(
      { _id: "orderId" },
      { $inc: { sequenceValue: 1 } },
      { 
        new: true, // Return the updated document
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true // Apply defaults when creating
      }
    );
    
    return counter.sequenceValue;
  } catch (error) {
    console.error("Error getting next order ID:", error);
    throw error;
  }
}