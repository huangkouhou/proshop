import { Card } from "react-bootstrap";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
        {/* 商品图片，点击跳转到详情页 */}
        <a href={`/product/${product._id}`}>
          <Card.Img src={product.image} variant="top"/>
        </a>
        <Card.Body>

        {/* 商品名称，点击跳转到详情页 */}
        <a href={`/product/${product._id}`}>
        <Card.Title as="div">
            <strong>{product.name}</strong>
        </Card.Title>
        </a>

        {/* 商品价格 */}
        <Card.Text as="h3">
            ${product.price}
          </Card.Text>
        </Card.Body>
      
    </Card>
  )
}

export default Product


/*
<Card>
 ├── <Card.Img>   👉 商品图片
 └── <Card.Body>  👉 商品详情（名称+价格）
       ├── <Card.Title>   👉 商品名称
       └── <Card.Text>    👉 商品价格
*/