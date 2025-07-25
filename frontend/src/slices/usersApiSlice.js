import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";//parents of all slices

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: USERS_URL/auth,
                method: 'POST',
                body: data,
            }),
        }),
        
    }),
});

export const { useLoginMutation } = usersApiSlice;

//RTK Query 提供的 内建函数
// | 方法名        | 说明                    | 例子           |
// | ---------- | --------------------- | ------------ |
// | `query`    | 读取数据（GET 请求）          | 获取用户、获取文章列表等 |
// | `mutation` | 修改数据（POST/PUT/DELETE） | 登录、注册、修改资料等  |