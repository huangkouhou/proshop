import jwt from 'jsonwebtoken';
import asyncHandler from "./asyncHandler.js";
import User from '../models/userModel.js';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ 从 Authorization header 或 Cookie 中读取 token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Admin middleware
const admin = (req, res, next) => {
  // ✅ 正确使用 req.user.isAdmin
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};

export { protect, admin };

// .select('-password') 是 Mongoose 提供的一种字段排除写法。
// -password 的意思是：从查询结果中排除掉 password 字段，也就是说 不要把用户的密码（即使是加密后的）传到 req.user 中去。