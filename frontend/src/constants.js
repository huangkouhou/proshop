//如果是开发环境（npm run dev 或 vite dev）：接口请求走本地 http://localhost:5001

// export const BASE_URL = process.env.NODE_ENV === 'development' ?
// 'http://localhost:5001' : ''; 

export const BASE_URL = '';
export const PRODUCTS_URL = '/api/products';
export const USER_URL = '/api/users';
export const ORDER_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';
