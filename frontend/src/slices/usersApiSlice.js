import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";//parents of all slices

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),

        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`, // 后端只有 /api/users 这个 POST 路径。
                method: 'POST',
                body: data,
            }),
        }),


        logout: builder.mutation({
            query: () => ({
                url:`${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),

        profile: builder.mutation({
            query: (data) => ({
                url:`${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),


    }),
});

export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useRegisterMutation,
    useProfileMutation 

} = usersApiSlice;

//RTK Query 提供的 内建函数
// | 方法名        | 说明                    | 例子           |
// | ---------- | --------------------- | ------------ |
// | `query`    | 读取数据（GET 请求）         | 获取用户、获取文章列表等 |
// | `mutation` | 修改数据（POST/PUT/DELETE） | 登录、注册、修改资料等  |