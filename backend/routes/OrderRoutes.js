import express from 'express';
import { 
    checkoutCart, 
    getAllOrder, 
    getOrder, 
    handleMidtransNotification, 
    orderSuccessPage 
} from '../controllers/orderController.js';
import { adminMiddleware, authMiddleware } from '../middleware/UserMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getOrder); // Get user's orders
router.get('/all', getAllOrder); // Get all orders (admin)
router.get('/success', authMiddleware, orderSuccessPage); // Order success page
router.post('/checkout', authMiddleware, checkoutCart); // Checkout cart
router.post('/midtrans/notification', handleMidtransNotification); // Midtrans notification callback

export default router;