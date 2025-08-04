import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Products'],
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),

        //Admin
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST',
            }),
            //这一句的作用是 告诉 RTK Query：这个 mutation 执行成功后，和 'Product' 相关的缓存都应该失效（作废），系统会自动重新请求获取更新数据。
            invalidatesTags: ['Product'],
        }),

        //Admin
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data._id}`, //✅ 后端的 updateProduct 是基于 _id 来更新产品的
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        

        //Admin 
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data,
            }),
        }),

        //admin
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method:'DELETE',
            }),
        }),
    }),
});

export const { 
    useGetProductsQuery, 
    useGetProductDetailsQuery, 
    useCreateProductMutation, 
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
} = productsApiSlice;

//RTK Query 提供的 内建函数
// | 方法名        | 说明                    | 例子           |
// | ---------- | --------------------- | ------------ |
// | `query`    | 读取数据（GET 请求）          | 获取用户、获取文章列表等 |
// | `mutation` | 修改数据（POST/PUT/DELETE） | 登录、注册、修改资料等  |
