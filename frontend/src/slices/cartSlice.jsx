import { createSlice } from "@reduxjs/toolkit";

//初始化购物车状态,判断本地浏览器 localStorage 里有没有 cart 数据,有就用本地缓存数据（防止刷新丢失购物车）,没有就初始化成空购物车 { cartItems: [] }
const initialState = localStorage.getItem("cart") ? JSON.parse
(localStorage.getItem("cart")):{cartItems: []};

//金额处理函数，把数字保留两位小数，输出字符串。
const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload; //拿到传进来的商品
            //判断购物车里是否已有该商品：
            const existItem = state.cartItems.find((x) => x._id === item._id);
            //如果购物车里已经存在该商品，替换原来购物车里的老数据（比如更新数量）
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => x._id ===
                existItem._id ? item: x);
            } else { 
                state.cartItems = [...state.cartItems, item];//把原购物车+新商品拼到一起
            }

            // Calculate items price
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => 
                acc + item.price * item.qty, 0));

            // Calculate shipping price
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
            // Calculate tax price(10% tax)
            state.taxPrice = addDecimals(state.itemsPrice * 0.1);

            // Calculate total price
            state.totalPrice = addDecimals(
                Number(state.itemsPrice) + 
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            );

            localStorage.setItem('cart', JSON.stringify(state));
        }
    },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;