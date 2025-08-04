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

        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
            }),
            providesTags: ['Users'], //这是用于 缓存管理 的标签系统，作用是告诉 RTK Query：这个查询结果会提供一个叫做 'Users' 的标签。
            keepUnusedDataFor: 5,
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),

        getUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
            }),
            keepUnusedDataFor: 5,
        }),

        updateUser: builder.mutation({
            query: ( data ) => ({                //✅ 不要解构 do not use ({data})
                url: `${USERS_URL}/${data._id}`, // ✅ 从 data._id 中取 ID
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),

    }),
});

export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} = apiSlice;

//RTK Query 提供的 内建函数
// | 方法名        | 说明                    | 例子           |
// | ---------- | --------------------- | ------------ |
// | `query`    | 读取数据（GET 请求）         | 获取用户、获取文章列表等 |
// | `mutation` | 修改数据（POST/PUT/DELETE） | 登录、注册、修改资料等  |


//✅ 正确理解：providesTags + invalidatesTags 是一对组合拳