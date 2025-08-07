import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc Fetch all products
//@route GET/api/products
//@access Public
const getProducts = asyncHandler(async(req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1; //从请求的 URL 查询参数中获取分页页码，如果没有传，就默认是第 1 页。
    
    //$regex 是 MongoDB 中用于执行模糊匹配字段内容，类似 SQL 的 LIKE，但更强大。
    //允许前端通过 /api/products?keyword=phone 模糊搜索商品名，用户体验更友好。
    const keyword = req.query.keyword 
        ? {name: { $regex: req.query.keyword, $options: 'i' } } //✅ 让正则匹配变成大小写不敏感（case-insensitive）。
        : {};

    const count = await Product.countDocuments({...keyword}); //统计 Product 集合中所有文档的数量（即：产品总数）

    const products = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page -1)); //MongoDB 的 .skip(n) 方法表示：“跳过前 n 条记录”。
    res.json({products, page, pages: Math.ceil(count / pageSize)}); //Math.ceil(...) 表示向上取整（因为可能不能整除）
});


//@desc Fetch a product
//@route GET/api/products/:id
//@access Public
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        return res.json(product);
    } else {
    res.status(404);
    throw new Error('Resource not found');
    }
});

//@desc Create a product
//@route POST/api/products
//@access Private/Admin
const createProduct = asyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })

    const createProduct = await product.save();
    res.status(201).json(createProduct);
});


//@desc Update a product
//@route PUT/api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async(req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updateProduct = await product.save();
        res.json(updateProduct);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});


//@desc Delete a product
//@route DELETE/api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      //Product.deleteOne 是来自 Mongoose 提供的 Model 静态方法。删除匹配的第一个文档。await product.remove();   await Product.findByIdAndDelete(req.params.id);
      await Product.deleteOne({_id: product._id});
      res.status(200).json({ message: 'Product delete' });
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});


//@desc Create a new review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    //// 查找某条评论，它的 user id 和当前登录用户一样（MongoDB 的 _id 是 ObjectId 类型，它不能用 === 直接比较。必须转换成字符串才可以进行值比较）
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    //重新计算当前商品的平均评分（product.rating），也就是所有评论的平均分。
    //.reduce() 方法对数组中的每个元素执行一个回调函数，并累积计算结果，最终返回一个值。
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length; //除以总评论数，计算平均值

    await product.save();

    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Resource not found'); 
  }
});


//@desc Get top rated products
//@route GET/api/products/top
//@access Public
const getTopProducts = asyncHandler(async(req, res) => {
    //rating: -1 是 MongoDB 中的排序语法，.sort({ rating: -1 })对结果按 rating 字段排序，-1 表示 降序（从高到低），.limit(3)只返回 前三个产品
    const products = await Product.find({}).sort({rating: -1}).limit(3);
    res.status(200).json(products);
});


export { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
};