import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: (process.env.CLIENT_URL || "http://localhost:5173").split(",").map(value => value.trim()), credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use("/products", express.static(path.join(__dirname, "../public/products")));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "ATELIER API" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => res.status(404).json({ message: "API route not found." }));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error?.code === 11000) return res.status(409).json({ message: "A record with that identifier already exists." });
  if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
  if (error?.name === "CastError") return res.status(400).json({ message: "Invalid identifier." });
  res.status(500).json({ message: "An unexpected server error occurred." });
});

try {
  await connectDB();
  app.listen(PORT, () => console.log(`ATELIER API running at http://localhost:${PORT}`));
} catch (error) {
  console.error(`Server could not start: ${error.message}`);
  process.exit(1);
}
