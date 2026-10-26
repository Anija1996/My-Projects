import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = { active: true };
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    const products = await Product.find(filter).sort({ id: 1 }).lean();
    res.json(products);
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id), active: true }).lean();
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (error) { next(error); }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id, name, price, category, image, description = "", colors = [], displayColor = "", sizes = [], newProduct = false } = req.body;
    if (!Number.isFinite(Number(id)) || !name || !Number.isFinite(Number(price)) || !category || !image) {
      return res.status(400).json({ message: "id, name, price, category, and image are required." });
    }
    const product = await Product.create({ id: Number(id), name, price: Number(price), category, image, description, colors, displayColor, sizes, newProduct });
    res.status(201).json(product);
  } catch (error) { next(error); }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates._id; delete updates.__v;
    if (updates.id !== undefined) updates.id = Number(updates.id);
    if (updates.price !== undefined) updates.price = Number(updates.price);
    const product = await Product.findOneAndUpdate({ id: Number(req.params.id) }, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (error) { next(error); }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate({ id: Number(req.params.id) }, { active: false }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product archived successfully." });
  } catch (error) { next(error); }
});

export default router;
