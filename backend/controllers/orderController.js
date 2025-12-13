import asyncHandler from "../middleware/asyncHandler.js";
import Order from '../models/orderModel.js';
import PAYPAY from '@paypayopa/paypayopa-sdk-node';
import { v4 as uuidv4 } from 'uuid';


//@desc Create new order
//@route POST/api/orders
//@access Private
const addOrderItems = asyncHandler(async(req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({ //遍历数组 orderItems 中的每个元素 x
                ...x,             //展开运算符（spread operator），会把对象 x 中的所有属性复制过来。
                product: x._id,   //添加一个新字段 product，把商品的 _id 存进去。
                _id: undefined    //清除原来的 _id 字段。MongoDB 中每个文档（包括嵌套的子文档）默认会有一个 _id。
            })),
            user: req.user._id, //从当前登录用户提取 MongoDB 的 _id，并把订单和这个用户在数据库里关联起来
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createOrder = await order.save();

        res.status(201).json(createOrder);
    }

});

//@desc Get Logged In User Order
//@route Get /api/orders/my orders
//@access Private
const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({ user: req.user._id});//会返回一个订单数组。因为一个用户可能有多个订单
    res.status(200).json(orders);
});

//@desc Get order by id
//@route Get/api/orders/:id
//@access Private
const getOrderById = asyncHandler(async(req, res) => {
    //根据 一个订单 ID 查找具体某一个订单。
    const order = await Order.findById(req.params.id).populate(
        'user', 'name email');
    
    if (order){
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

//@desc update order to paid
//@route PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
});

//@desc Update order to delivered
//@route PUT /api/orders/:id/delivered
//@access Private/Admin
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

//@desc Get all orders
//@route Get /api/orders
//@access Private/Admin
const getOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({})      // 查询所有订单
    .populate('user', 'name');            // 联表查询，获取每笔订单关联的用户的 id 和 name 字段
    res.status(200).json(orders);
});


//populate 是 Mongoose 提供的一个非常强大的方法，用于在查询时自动填充引用（ref）字段所关联的文档内容。
// 简单来说，它让你在查询一个文档的同时，把它关联的其他文档内容也“带出来”。
// .populate({
//   path: 'user',
//   select: '_id name'
// });




// 创建 PayPay 支付链接
// @desc    Create PayPay payment link
// @route   POST /api/orders/:id/paypay
// @access  Private
const createPayPayPayment = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);

    if (order){
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        PAYPAY.Configure({
            clientId: process.env.PAYPAY_API_KEY,
            clientSecret: process.env.PAYPAY_API_SECRET,
            merchantId: process.env.PAYPAY_MERCHANT_ID,
            productionMode: false,// 测试环境必须是 false
        });
        const paymentId = uuidv4();//generate unique id

        const payload = {
            merchantPaymentId: paymentId,
            amount: {
                    amount: Math.floor(order.totalPrice),
                    currency: 'JPY',
                },
                codeType: 'ORDER_QR',
                orderDescription: `Order ${order._id}`,
                isAuthorization: false,
                redirectUrl: `${baseUrl}/order/${order._id}`,
                redirectType: 'WEB_LINK',
                userAgent: req.get('User-Agent'),
            };

            // 调用 PayPay API
            const response = await PAYPAY.QRCodeCreate(payload);

            const responseBody = response.BODY || response.body;


            // 把生成的跳转链接 (url) 发给前端
            if (responseBody && responseBody.resultInfo && responseBody.resultInfo.code === 'SUCCESS') {
                res.json({ url: responseBody.data.url });
            } else {
                res.status(500);
                throw new Error('PayPay API Error: ' + response.body.resultInfo.message);
            }
        } else {
            res.status(404);
            throw new Error('Order not found');
        }

    });



export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    createPayPayPayment,

};