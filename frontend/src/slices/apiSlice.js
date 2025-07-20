//createApi + fetchBaseQuery 是Redux Toolkit 的官方推荐数据请求方案，替代了 Axios + Redux 手动管理，简化 API 请求 & 缓存流程
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants.js';

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL});


export const apiSlice = createApi({
    baseQuery,   //统一请求基础地址（自动拼接）
    tagTypes: ['Product', 'Order', 'User'], //用于缓存控制（智能缓存失效机制）
    endpoints: (builder) => ({}), 
});

