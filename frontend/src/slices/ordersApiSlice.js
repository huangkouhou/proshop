import { apiSlice } from "./apiSlice";
import { ORDER_URL, PAYPAL_URL } from "../constants";



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

        payOrder: builder.mutation({
            query: ({orderId, details}) => ({
                url: `${ORDER_URL}/${orderId}/pay`,
                method: 'PUT',
                body: {...details},
            }),
        }),
        getPayPalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL
            }),
            keepUnusedDataFor: 5,
        }),

        getMyOrders: builder.query({
            query:() => ({
                url:`${ORDER_URL}/mine`,
            }),
            keepUnusedDataFor: 5,
        }),

        //admin user
        getOrders: builder.query({
            query: () => ({
                url: ORDER_URL,
            }),
            keepUnusedDataFor: 5,
        }),

        //admin user
       deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDER_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),

        


    }),
});

export const { 
    useCreateOrderMutation, 
    useGetOrderDetailsQuery, 
    usePayOrderMutation, 
    useGetPayPalClientIdQuery,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
} = ordersApiSlice;




//RTK Query 提供的 内建函数
// | 方法名        | 说明                    | 例子           |
// | ---------- | --------------------- | ------------ |
// | `query`    | 读取数据（GET 请求）          | 获取用户、获取文章列表等 |
// | `mutation` | 修改数据（POST/PUT/DELETE） | 登录、注册、修改资料等  |