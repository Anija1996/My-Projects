import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
await connectDB();
const productsPath = path.join(__dirname, "../data/products.json");
const products = JSON.parse(await fs.readFile(productsPath, "utf8"));
for (const product of products) {
  await Product.updateOne({ id: product.id }, { $set: product }, { upsert: true, runValidators: true });
}
console.log(`Seeded ${products.length} ATELIER products.`);
process.exit(0);
