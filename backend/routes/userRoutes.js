import express from "express";
const router = express.Router();
import { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserByID,
    updateUser,
} from "../controllers/userController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

// 注册 + 获取用户列表 admin
router.route('/').post(registerUser).get(protect, admin, getUsers);

// 登录 + 登出
router.post('/auth', authUser);
router.post('/logout', logoutUser);

// 获取和更新当前登录用户信息
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// 管理用户 by ID admin
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserByID).put(protect, admin, updateUser);

export default router;
