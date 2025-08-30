import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  city: String,
  metric: String, // e.g. rain, tide, pollution
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Report", reportSchema);
