import { Router } from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ date: -1 }).lean();
    res.json(orders);
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await Order.findOne({ id: req.params.id, user: req.user._id }).lean();
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const { items, delivery, discountCode = "" } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "Your cart is empty." });
    if (!delivery || !delivery.email || !delivery.street || !delivery.city || !delivery.postal) {
      return res.status(400).json({ message: "Complete your delivery details before placing the order." });
    }
    const ids = [...new Set(items.map(item => Number(item.id)))];
    const products = await Product.find({ id: { $in: ids }, active: true }).lean();
    const productMap = new Map(products.map(product => [product.id, product]));
    const orderItems = [];
    for (const item of items) {
      const product = productMap.get(Number(item.id));
      const quantity = Number(item.quantity);
      if (!product) return res.status(400).json({ message: "A product in your cart is no longer available." });
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return res.status(400).json({ message: "Invalid product quantity." });
      if (item.size && product.sizes.length && !product.sizes.includes(item.size)) return res.status(400).json({ message: `Invalid size selected for ${product.name}.` });
      if (item.color && product.colors.length && !product.colors.includes(item.color)) return res.status(400).json({ message: `Invalid color selected for ${product.name}.` });
      orderItems.push({
        id: product.id, name: product.name,
        image: `${(process.env.SERVER_URL || "http://localhost:5000").replace(/\/$/, "")}/products/${encodeURIComponent(product.image)}`,
        price: product.price, quantity, size: item.size || product.sizes?.[0] || "", color: item.color || product.colors?.[0] || ""
      });
    }
    const subtotal = Math.round(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
    const code = String(discountCode).trim().toUpperCase();
    const discountRate = code === "ATELIER10" ? 0.10 : code === "ATELIER20" ? 0.20 : 0;
    const discount = Math.round(subtotal * discountRate * 100) / 100;
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.085 * 100) / 100;
    const shipping = 0;
    const total = Math.round((taxable + tax + shipping) * 100) / 100;
    const order = await Order.create({
      id: `AT-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      user: req.user._id, items: orderItems, subtotal, discount, discountCode: discountRate ? code : "",
      tax, shipping, total, delivery, status: "Ordered", date: new Date()
    });
    res.status(201).json(order);
  } catch (error) { next(error); }
});

export default router;
