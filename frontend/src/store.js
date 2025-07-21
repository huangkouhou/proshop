import { configureStore } from "@reduxjs/toolkit"; //创建 Redux 的全局状态管理 store。
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer  from './slices/cartSlice'; 

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;