import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

return (
  <>
    {/* ✅ 用花括号 { ... } 包住整段条件渲染，三元表达式写在里面 */}
    {isLoading ? (  // ✅ 加括号
      <Loader />
    ) : error ? (   // ✅ 加括号
      <Message variant='danger'>{error}</Message>
    ) : products && products.length > 0 ? (  // ✅ 加上 null 和空数组保护
      <Carousel pause='hover' className='bg-primary mb-4'>
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} alt={product.name} fluid />
              <Carousel.Caption className='carousel-caption'>
                <h2>
                  {product.name} (¥{product.price.toLocaleString('ja-JP')})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    ) : null}
  </>
);

}

export default ProductCarousel
