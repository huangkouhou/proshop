import express from "express";
const router = express.Router();
import { 
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
} from "../controllers/orderController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

//server.js 中，已经定义好了所有 orderRoutes 中定义的路由都会自动加上 /api/orders 作为前缀。
router.route('/')
.post(protect, addOrderItems) 
.get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);



export default router;
