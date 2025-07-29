import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";//userSchema对 password 做加密处理,使用 bcrypt 做加密
import generateToken from "../utils/generateToken.js";

//@desc Auth user & get token
//@route POST/api/users/login
//@access Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const token = generateToken(res, user._id);  // ✅ 把 token 接出来

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
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
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    //创建新用户
    const user = await User.create({
        name,
        email,
        password
    });

    //如果创建成功，返回用户信息（不包含密码）
    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

});

//@desc Logout user / clear cookie
//@route POST/api/users/logout
//@access Private
const logoutUser = asyncHandler(async(req, res) => { //clear the cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

//@desc Get user profile
//@route Get/api/users/profile
//@access Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

//@desc Update user profile
//@route Put /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if(user) {
        user.name = req.body.name || user.name;// req.body.name 有值 → 更新 user.name, req.body.name 没有值 → 保持原值 user.name
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }
    

        const updatedUser = await user.save();

        //返回更新后的用户数据
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(user._id), // ← 返回 token
        });

  } else {
    res.status(404);
    throw new Error('User not found');
  }
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