import { createSlice } from '@reduxjs/toolkit';

//尝试从浏览器本地读取键名为 'userInfo' 的数据（字符串）
const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.  
        getItem('userInfo')) : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        //定义一个 reducer 函数 setCredentials，当你 dispatch 一个 login 成功的 action 时，就会调用它。
        setCredentials: (state, action) => {
            state.userInfo = action.payload;//把服务器返回的用户信息（在 action.payload 里）写入到 Redux 的 state 中。
            localStorage.setItem('userInfo', JSON.stringify(action.payload));//把用户信息也同步写入 localStorage，用于持久保存。这样即使刷新页面也能保留登录状态。
        },
        logout: (state,action) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;