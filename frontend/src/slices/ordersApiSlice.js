import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../constants";


export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDER_URL,
                method: 'POST',
                body: {...order}
            }),
        }),
        getOrderDetails: builder.query({
            query:(orderId) => ({
                url:`${ORDER_URL}/${orderId}`
            }),
            keepUnusedDataFor: 5
        }),
    }),
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery } = ordersApiSlice;




//RTK Query 提供的 内建函数
// | 方法名        | 说明                    | 例子           |
// | ---------- | --------------------- | ------------ |
// | `query`    | 读取数据（GET 请求）          | 获取用户、获取文章列表等 |
// | `mutation` | 修改数据（POST/PUT/DELETE） | 登录、注册、修改资料等  |