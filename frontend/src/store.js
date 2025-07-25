import { configureStore } from "@reduxjs/toolkit"; //创建 Redux 的全局状态管理 store。
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer  from './slices/cartSlice'; 
import authSliceReducer from './slices/authSlice';


//组合多个 reducer 的地方
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;