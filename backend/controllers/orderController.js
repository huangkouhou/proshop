import asyncHandler from "../middleware/asyncHandler.js";


//@desc Create new order
//@route POST/api/orders
//@access Private
const addOrderItems = asyncHandler(async(req, res) => {
    res.send('add order items');
});

//@desc Get Logged In User Order
//@route Get /api/orders/my orders
//@access Private
const getMyOrders = asyncHandler(async(req, res) => {
    res.send('get my orders');
});

//@desc Get order by id
//@route Get/api/orders/:id
//@access Private
const getOrderById = asyncHandler(async(req, res) => {
    res.send('get order by id');
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