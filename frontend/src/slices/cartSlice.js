import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

//初始化购物车状态,判断本地浏览器 localStorage 里有没有 cart 数据,有就用本地缓存数据（防止刷新丢失购物车）,没有就初始化成空购物车 { cartItems: [] }
const initialState = localStorage.getItem("cart") ? JSON.parse
(localStorage.getItem("cart"))
:{cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal'};



const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        //new function
        addToCart: (state, action) => {
            const item = action.payload; //payload是新加入的商品（或更新的商品）
            //判断购物车里是否已有该商品：
            const existItem = state.cartItems.find((x) => x._id === item._id);//state.cartItems是在initialState 里定义的
            //如果购物车里已经存在该商品，替换原来购物车里的老数据（通常是更新数量）
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => x._id ===
                existItem._id ? item: x);
            } else { 
                state.cartItems = [...state.cartItems, item];//把原购物车+新商品拼到一起
            }

            return updateCart(state);
        },

        removeFromCart: (state, action) => {
            //action.payload传进来的商品 _id（要删除的商品 ID）,state.cartItems.filter()遍历购物车，保留所有不是这个 ID 的商品
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            
            return updateCart(state);
        },

        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },

        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },

        clearCartItems: (state) => {
            state.cartItems = [];
            return updateCart(state);
        },

    },
});

export const { 
    addToCart, 
    removeFromCart, 
    saveShippingAddress, 
    savePaymentMethod,
    clearCartItems, 
} = cartSlice.actions;

export default cartSlice.reducer; //追加到Redux 的全局状态管理 store.js