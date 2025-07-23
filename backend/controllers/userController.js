import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

//@desc Auth user & get token
//@route POST/api/users/login
//@access Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id }, process.env.
            JWT_SECRET, { //.env
                expiresIn: '30d'
        });

        // Set JWT as HTTP-Only cookie 把生成的 JWT（用户登录后的 Token）存入浏览器的 Cookie 中，用于后续请求中自动携带 Token 来验证身份。
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 Days
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }

});


//@desc Register
//@route POST/api/users
//@access Public
const registerUser = asyncHandler(async(req, res) => {
    res.send('register user');
});

//@desc Logout user / clear cookie
//@route POST/api/users/logout
//@access Private
const logoutUser = asyncHandler(async(req, res) => {
    res.send('register user');
});

//@desc Get user profile
//@route Get/api/users/profile
//@access Private
const getUserProfile = asyncHandler(async(req, res) => {
    res.send('get user profile');
});

//@desc Update user profile
//@route Put /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async(req, res) => {
    res.send('update user profile');
});


//@desc Get users
//@route Get /api/users
//@access Private/Admin     use Token here
const getUsers = asyncHandler(async(req, res) => {
    res.send('get users');
});

//@desc Get user by id
//@route Get /api/user/:id
//@access Private/Admin     
const getUserByID = asyncHandler(async(req, res) => {
    res.send('get user by id');
});

//@desc Delete user
//@route Delete /api/users/:id
//@access Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
    res.send('delete user');
});


//@desc Update user
//@route PUT /api/users/:id
//@access Private/Admin
const updateUser = asyncHandler(async(req, res) => {
    res.send('update user');
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserByID,
    updateUser,
};