import asyncHandler from "../middleware/asyncHandler.js";
import Order from '../models/orderModel.js';


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
//@route GET /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    res.send('update order to paid');
});

//@desc Update order to delivered
//@route Get /api/orders/:id/delivered
//@access Private/Admin
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    res.send('update order to delivered');
});

//@desc Get all orders
//@route Get /api/orders
//@access Private/Admin
const getOrders = asyncHandler(async(req, res) => {
    res.send('get all orders');
});


export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
};