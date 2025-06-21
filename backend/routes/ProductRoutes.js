import express from 'express';
import {
  getProducts,
  getProductsById,
  postProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from '../controllers/productController.js';
import upload from '../middleware/uploadMiddleware.js';
import { adminMiddleware, authMiddleware } from '../middleware/UserMiddleware.js';

const router = express.Router();

// IMPORTANT: Place specific routes before dynamic routes
router.get('/category/:id_category', getProductsByCategory); // Move this before '/:id'
router.get('/', getProducts);
router.get('/:id', getProductsById);
router.post('/', 
  authMiddleware, 
  adminMiddleware, 
  upload.array('images', 10), // Maximum 10 images
  postProducts
);
router.put('/:id', 
  authMiddleware, 
  adminMiddleware, 
  upload.array('images', 10), // For adding new images
  updateProduct
);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;