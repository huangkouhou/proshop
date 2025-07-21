import { useParams } from "react-router-dom"; //useParams() 会读取 URL 里的参数，params.id 就是URL 里的参数
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";

// import { useState, useEffect } from 'react';
// import axios from "axios";

const ProductScreen = () => {
//   const [ product, setProduct ] = useState({});

  const { id:productId } = useParams();

//   useEffect(() => {
//     const fetchProduct = async () => {
//         const { data } = await axios.get(`/api/products/${productId}`);
//         setProduct(data);
//     }

//     fetchProduct();
//   }, [productId]);//如果写 [productId]每当 URL 中的 productId 变化时，useEffect 会重新运行，这样就能加载新商品的数据。
  
const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);


if (isLoading) {
return <h2>Loading...</h2>;
}

if (error) {
return <div>{ error?.data?.message || error.error }</div>;
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

            <ListGroup.Item>
            <Button
                className='btn-block'
                type='button'
                disabled={product.countInStock === 0}
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
