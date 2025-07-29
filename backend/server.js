import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
const port = process.env.PORT || 5001;

connectDB();//Connect to MongoDB

const app = express();

//Body parser middleware启用 body parser 中间件，让你的 Express 服务器能够正确解析来自客户端的请求体（body），尤其是 POST 请求中的数据。
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);


app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server running on port ${port}`));
