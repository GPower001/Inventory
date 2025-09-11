// import mongoose from "mongoose";

// const itemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: String, required: true },
//   openingQty: { type: Number, required: true },
//   minStock: { type: Number, required: true },
//   itemCode: { type: String, unique: true },
//   imageUrl: { type: String },
//   expiryDate: { type: Date },
// }, { timestamps: true });

// const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
// export default Item;


import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    openingQty: { type: Number, required: true },
    minStock: { type: Number, required: true },
    itemCode: { type: String, required: true }, // remove global unique
    imageUrl: { type: String },
    expiryDate: { type: Date },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  },
  { timestamps: true }
);

// ✅ Compound index: itemCode must be unique only within a branch
itemSchema.index({ itemCode: 1, branchId: 1 }, { unique: true });

// ✅ Index for branch queries (optional, good for performance)
itemSchema.index({ branchId: 1 });

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
export default Item;
