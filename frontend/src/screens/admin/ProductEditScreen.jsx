import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useUpdateProductMutation, useGetProductDetailsQuery } from "../../slices/productsApiSlice";



const ProductEditScreen = () => {
  //从 URL 参数中获取 id，并重命名为 productId   解构并重命名
  const {id: productId } = useParams();

  //const [变量, 设置变量的函数] = useState(初始值);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  //从这个 useGetProductDetailsQuery 结果中提取几个字段：
  const { 
    data: product, 
    isLoading, 
    refetch, 
    error, 
} = useGetProductDetailsQuery(productId);

  const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
    } 
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
        _id: productId,  // ✅ 一定要加上 _id 字段名
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
    }
  

  const result = await updateProduct(updatedProduct);
    if (result.error) {
        toast.error(result.error);
    } else {
        toast.success('Product updated');
        navigate('/admin/productlist');
    }
};

  return (
<>
    <Link to="/admin/productlist" className="btn btn-light my-3">
      Go Back
    </Link>

    <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            //表单的提交事件应该由 <form> 控制，而不是按钮
            <Form onSubmit={ submitHandler }>
                <Form.Group controlId="name" className="my-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="price" className="my-2">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {/* IMAGE INPUT PLACEHOLDER */}

                <Form.Group controlId="brand" className="my-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder="Enter brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="countInStock" className="my-2">
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder="Enter countInStock"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="category" className="my-2">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="description" className="my-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"          // ✅ 变成多行文本输入框
                        rows={3}               // ✅ 显示3行高度
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></Form.Control>
                </Form.Group>
               {/*type="submit"，会自动触发外层 <form> 的 onSubmit。*/}
                <Button type='submit' variant='primary' className="my-2">
                    Update
                </Button>


            </Form>
        )}
    </FormContainer>
    



</> 
  );
}

export default ProductEditScreen
