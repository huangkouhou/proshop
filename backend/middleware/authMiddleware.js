import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from '../models/userModel.js';

//Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    //Read the JWT from the cookie
    token = req.cookies.jwt;

    if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.userId).select('-password'); //返回这个用户的所有字段，除了 password 字段。
          next();
        } catch(error) {
        console.log(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
        }
        
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

});


// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.res.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
}

export { protect, admin };



// .select('-password') 是 Mongoose 提供的一种字段排除写法。
// -password 的意思是：从查询结果中排除掉 password 字段，也就是说 不要把用户的密码（即使是加密后的）传到 req.user 中去。