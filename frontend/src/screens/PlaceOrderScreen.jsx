import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; //用 useDispatch 改变状态，用 useSelector 读取状态
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { formatJPY } from "../utils/cartUtils";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address){//用户没填地址	跳转去 /shipping 页面填写收货地址
        navigate('/shipping');
    } else if (!cart.paymentMethod) {//用户没选支付方式	跳转去 /payment 页面选择付款方式
        navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);//只要这些值变化，就会重新执行 useEffect（navigate用到了，就写上，避免隐患，提升可读性。）

  const placeOrderHandler = async() => {
    try{
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
        dispatch(clearCartItems());
        navigate(`/order/${res._id}`);
    } catch (error){
        toast.error(error);
    }
  };

  return(
  <>
    <CheckoutSteps step1 step2 step3 step4 />
    <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>shipping</h2>
                    <p>
                        <strong>Address:</strong>
                        {cart.shippingAddress.address}, {cart.shippingAddress.city}
                        {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                    </p>
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Payment</h2>
                    <strong>Method:</strong>
                    {cart.paymentMethod}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {cart.cartItems.length === 0? (
                        <Message>Your cart is empty</Message>
                    ) : (
                        <ListGroup variant='flush'>
                            {cart.cartItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                          <Image
                                            src={item.image}
                                            alt={item.name}
                                            fluid //图片会根据父容器宽度自动缩放（即宽度 100%，高度自动）
                                            rounded
                                          />
                                        </Col>
                                        <Col>
                                          <Link to={`/product/${item.product}`}>
                                          {item.name}
                                          </Link>
                                        </Col>

                                        <Col md={4}>
                                        {item.qty} × {formatJPY(item.price)} = {formatJPY(item.qty * item.price)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </ListGroup.Item>

            </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col>Items:</Col>
                        <Col>
                        { formatJPY(cart.itemsPrice) }
                        </Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col>Shipping:</Col>
                        <Col>
                        { formatJPY(cart.shippingPrice) }
                        </Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col>Tax:</Col>
                        <Col>
                        { formatJPY(cart.taxPrice) }
                        </Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                    <Row>
                        <Col>Total:</Col>
                        <Col>
                        { formatJPY(cart.totalPrice) }
                        </Col>
                    </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                { error && <Message variant='danger'>{JSON.stringify(error.data?.message || error.message || error)}</Message> }
                </ListGroup.Item>

                <ListGroup.Item>
                    <Button
                        type='button'
                        className='btn-block'
                        disabled={cart.cartItems.length === 0}
                        onClick={placeOrderHandler}
                    >
                        Place Order
                    </Button>
                    { isLoading && <Loader />}
                </ListGroup.Item>

            </ListGroup>
          </Card>
        </Col>
    </Row>
  </>
  );
};

export default PlaceOrderScreen
