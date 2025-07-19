const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req,res, next)).catch(next);// 自动把错误交给 Express 的全局 error handler
}

export default asyncHandler;

//让 express 路由支持 async/await 而不会漏掉错误