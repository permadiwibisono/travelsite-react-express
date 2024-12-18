import express from "express";
import {
  getCategory,
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
router.get("/:id", getProductByCategory);
router.post("/", authMiddleware, adminMiddleware, postCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory); // Add delete route
router.put("/:id", authMiddleware, adminMiddleware, updateCategory); // Add update route


export default router;
