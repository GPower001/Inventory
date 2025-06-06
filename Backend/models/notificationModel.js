import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["low-stock", "expired"], required: true },
    message: { type: String, required: true },
    item: { type: String, required: true },
    count: { type: Number, default: null },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);