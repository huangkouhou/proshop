import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';

const HomeScreen = () => {
  const [ products, setProducts ] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    };

    fetchProducts();
  }, []);//空数组，表示只在页面挂载时运行一次

  return (
    <>
        <h1>Latest Products</h1>
        <Row>         {/*这里 Product 就是 HomeScreen 的子组件。*/}
            {products.map((product) => (      /*.map() 是遍历数组的方法, 每一个商品都会渲染出一个 <Col> 组件，products代表一组商品（数组），product代表单个商品（数组中的一个元素），单数，因为 .map() 里每次循环拿到的是一个商品*/
                <Col key={product.id} sm={12} md={6} lg={4} xl={3}> 
                    <Product product={product}/>
                </Col>
            ))}

        </Row>
      
    </>
  )
}

export default HomeScreen
