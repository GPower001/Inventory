import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  openingQty: { type: Number, required: true },
  minStock: { type: Number, required: true },
  itemCode: { type: String, unique: true },
  imageUrl: { type: String },
  expiryDate: { type: Date },
}, { timestamps: true });

export default mongoose.models.Item || mongoose.model("Item", itemSchema);