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

// 注册 + 获取用户列表
router.route('/').post(registerUser).get(getUsers);

// 登录 + 登出
router.post('/login', authUser);
router.post('/logout', logoutUser);

// 获取和更新当前登录用户信息
router.route('/profile').get(getUserProfile).put(updateUserProfile);

// 管理用户 by ID
router.route('/:id').delete(deleteUser).get(getUserByID).put(updateUser);

export default router;
