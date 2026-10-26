import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, default: "" },
  color: { type: String, default: "" }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountCode: { type: String, default: "" },
  tax: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  delivery: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, default: "Ordered" },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
