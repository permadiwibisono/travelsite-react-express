import express from "express";
import {
  getCategory,
  getCategoryById,
  postCategory,
  getProductByCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";
const router = express.Router();
import {
  adminMiddleware,
  authMiddleware,
  superAdminMiddleware,
} from "../middleware/UserMiddleware.js";

router.get("/", getCategory);
router.get("/:id", getCategoryById); // Get single category by ID
router.get("/:id/products", getProductByCategory); // Alternative route for products by category
router.post("/", authMiddleware, adminMiddleware, postCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);

export default router;