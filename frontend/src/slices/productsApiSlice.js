import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productsApiSlice;

//RTK Query 提供的 内建函数
// | 方法名        | 说明                    | 例子           |
// | ---------- | --------------------- | ------------ |
// | `query`    | 读取数据（GET 请求）          | 获取用户、获取文章列表等 |
// | `mutation` | 修改数据（POST/PUT/DELETE） | 登录、注册、修改资料等  |
