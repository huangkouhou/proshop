import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { //.env
        expiresIn: '30d'
    });

    // Set JWT as HTTP-Only cookie 把生成的 JWT（用户登录后的 Token）存入浏览器的 Cookie 中，用于后续请求中自动携带 Token 来验证身份。
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 Days
    });

    return token;
};

export default generateToken;