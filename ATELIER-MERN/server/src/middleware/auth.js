import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Please sign in to continue." });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "Account no longer exists." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
}

export function requireAdmin(req, res, next) {
  const configuredAdmin = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!configuredAdmin || req.user?.email !== configuredAdmin) {
    return res.status(403).json({ message: "Admin access is required for product changes." });
  }
  next();
}
