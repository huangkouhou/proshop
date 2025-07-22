import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; //useParams() 会读取 URL 里的参数，params.id 就是URL 里的参数
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import Rating from '../components/Rating';
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import { addToCart } from "../slices/cartSlice";

// import { useState, useEffect } from 'react';
// import axios from "axios";

const ProductScreen = () => {
//   const [ product, setProduct ] = useState({});
const { id:productId } = useParams();

const dispatch = useDispatch();
const navigate = useNavigate();

const [ qty, setQty ] = useState(1); //默认数量是「买 1 个」


//   useEffect(() => {
//     const fetchProduct = async () => {
//         const { data } = await axios.get(`/api/products/${productId}`);
//         setProduct(data);
//     }

//     fetchProduct();
//   }, [productId]);//如果写 [productId]每当 URL 中的 productId 变化时，useEffect 会重新运行，这样就能加载新商品的数据。
  
const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
const addToCartHandler = () => {
    dispatch(addToCart({...product, qty}));
    navigate('/cart');
};

if (isLoading) {
return <Loader/>
}

if (error) {
return <Message variant='danger'>{ error?.data?.message || error.error }</Message>;
}

return (
<>
    <Link className='btn btn-light my-3' to='/'>
    Go Back
    </Link>

    <Row>
    <Col md={5}>
        <Image src={product.image} alt={product.name} fluid />
    </Col>

    <Col md={4}>
        <ListGroup variant='flush'>
        <ListGroup.Item>
            <h3>{product.name}</h3>
        </ListGroup.Item>

        <ListGroup.Item>
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </ListGroup.Item>

        <ListGroup.Item>
            Price: ${product.price}
        </ListGroup.Item>

        <ListGroup.Item>
            Description: {product.description}
        </ListGroup.Item>
        </ListGroup>
    </Col>

    <Col md={3}>
        <Card>
        <ListGroup variant='flush'>
            <ListGroup.Item>
            <Row>
                <Col>Price:</Col>
                <Col>
                <strong>${product.price}</strong>
                </Col>
            </Row>
            </ListGroup.Item>

            <ListGroup.Item>
            <Row>
                <Col>Status:</Col>
                <Col>
                <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                </Col>
            </Row>
            </ListGroup.Item>

            {/*在商品库存大于 0 时，渲染一个「商品数量选择下拉框」。Form.Control react-bootstrap 的表单控件,as='select'渲染成 HTML 的 <select> 下拉菜单*/}
            {product.countInStock > 0 && (
                <ListGroup.Item>
                    <Row>
                        <Col>Qty</Col>
                        <Col>
                            <Form.Control           
                                as='select'
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}>
                                    {[...Array(product.countInStock).keys()].map(x => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                            </Form.Control>
                        </Col>
                    </Row>


                </ListGroup.Item>
            )}

            <ListGroup.Item>
            <Button
                className='btn-block'
                type='button'
                disabled={product.countInStock === 0}
                onClick={addToCartHandler}
            >
                Add To Cart
            </Button>
            </ListGroup.Item>
        </ListGroup>
        </Card>
    </Col>
    </Row>
</>
);
};

export default ProductScreen
