const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req,res, next)).catch(next);// 自动把错误交给 Express 的全局 error handler
} //next(err) 是 Express 中的内建错误传播机制。

export default asyncHandler;

//让 express 路由支持 async/await 而不会漏掉错误