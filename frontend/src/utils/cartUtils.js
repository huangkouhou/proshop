//金额处理函数，把数字保留两位小数，输出字符串。
export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
    // Calculate items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => //acc 是 reduce 的累加器（accumulator），acc 初始值是 0
        acc + item.price * item.qty, 0));

    // Calculate shipping price(If order is over $100 then free, else $10)
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
    // Calculate tax price(10% tax)
    state.taxPrice = addDecimals(state.itemsPrice * 0.1);

    // Calculate total price
    state.totalPrice = addDecimals(
        Number(state.itemsPrice) + 
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    );

    //购物车状态持久化，存到本地，保证刷新页面不会丢失购物车。	把 Redux 里的 state（对象）转换成字符串，因为 localStorage 只能存字符串
    localStorage.setItem('cart', JSON.stringify(state)); //把购物车的最新状态 state 保存到浏览器的本地存储（localStorage）。

    return state;
}