import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { formatJPY } from '../utils/cartUtils';
import { 
    useGetOrderDetailsQuery, 
    usePayOrderMutation, 
    useGetPayPalClientIdQuery,
    useDeliverOrderMutation, 
    useCreatePayPayPaymentMutation,
} from '../slices/ordersApiSlice';



const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { 
    data: order, 
    refetch,
    isLoading, 
    error, 
  } = useGetOrderDetailsQuery(orderId); 

  //payOrder：是一个函数，调用它就会发起支付请求 PUT /api/orders/:id/pay
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

  //专门用于控制和读取 PayPal JS SDK 的加载状态。
  const [{ isPending }, paypalDispatch ] = usePayPalScriptReducer();

  //initiate PayPay Mutation
  const [createPayPayPayment, { isLoading: loadingPayPay }] = useCreatePayPayPaymentMutation();


  //从后端获取 PayPal 的 client-id 的 RTK Query 请求。
  const { 
    data: paypal, 
    isLoading: loadingPayPal, 
    error: errorPayPal 
} = useGetPayPalClientIdQuery();

  //解构 Redux 中 auth 状态的 userInfo 字段。
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId){
        const loadPayPalScript = async() => {
            // 设置 PayPal SDK 参数
            paypalDispatch({
                type: 'resetOptions',
                value: {
                    'client-id': paypal.clientId,
                    currency: 'JPY',
                }
            });
            // 设置加载状态
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
        }
        //仅在订单存在 且尚未付款时加载 PayPal 脚本
        if (order && !order.isPaid) {
            if (!window.paypal){
                loadPayPalScript();
            }
        }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function(details){ //details 是 PayPal 自动传入的
        try {
          await payOrder({ orderId, details }); //PayPal 成功付款的结果传给后端，让订单状态变成“已支付”，payOrder mutation 函数用来调用某个后端接口。
          refetch();
          toast.success('Payment Successful');
        } catch(err) {
          toast.error(err?.data?.message || err.message);
        }
    });
  }

//   async function onApproveTest() {
//     await payOrder({ orderId, details: {payer: {} } });
//         refetch();
//         toast.success('Payment Successful');
//   }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order.create({ //PayPal JS SDK 提供的方法
        purchase_units: [
            {
                amount: {
                    value: order.totalPrice,
                },
            },
        ],
    }).then((orderId) => {
        return orderId;//PayPal 创建完订单后会返回一个 订单 ID，你需要把这个 ID 返回给 PayPal，它会记录并用于后续付款流程。
    });
  }

  const deliverOrderHandler = async () => {
    try {
        await deliverOrder(orderId);
        refetch();
        toast.success('Order delivery');
    } catch (err) {
        toast.error(err?.data?.message || err.message);
    }
  }

    const payWithPayPayHandler = async() => {
        try {
            // 调用的是上面解构出来的 createPayPayPayment 函数
            const res = await createPayPayPayment(orderId).unwrap();

            if(res.url){
                window.location.href = res.url;
            }
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    };


  return isLoading ? (
    <Loader /> 
    ): error ? (
    <Message variant="danger" />
    ):(
    <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
            <ListGroup>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                        <strong>Name: </strong> {order.user.name}
                    </p>
                    <p>
                        <strong>Email: </strong> {order.user.email}
                    </p>
                    <p>
                        <strong>Address: </strong>
                        {order.shippingAddress.address}, {order.shippingAddress.city}{' '} 
                        {order.shippingAddress.postalCode}, {' '}
                        {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? (
                        <Message variant='success'>
                            Delivered on {order.deliveredAt}
                        </Message>
                    ) : (
                        <Message variant='danger'>
                            Not Delivered
                        </Message>
                    ) }
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                        <strong>Method: </strong>
                        {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                        <Message variant='success'>
                            Paid on {order.paidAt}
                        </Message>
                    ) : (
                        <Message variant='danger'>
                            Not Paid
                        </Message>
                    ) }
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                            <Row>
                                <Col md={1}>
                                    <Image src={item.image} alt={item.name} fluid rounded/>
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
                                    <Col>Items</Col>
                                    <Col>{formatJPY(order.itemsPrice)}</Col>
                                </Row>

                                <Row>
                                    <Col>Shipping Price</Col>
                                    <Col>{formatJPY(order.shippingPrice)}</Col>
                                </Row>

                                <Row>
                                    <Col>Tax Price</Col>
                                    <Col>{formatJPY(order.taxPrice)}</Col>
                                </Row>

                                <Row>
                                    <Col>Total Price</Col>
                                    <Col>{formatJPY(order.totalPrice)}</Col>
                                </Row>
                            </ListGroup.Item>


                            { !order.isPaid && (
                                <ListGroup.Item>
                                    {(loadingPay || loadingPayPay) && <Loader />}

                                    {order.paymentMethod === 'PayPay' ? (
                                        <Button 
                                            type='button' 
                                            className='btn-block' 
                                            style={{ 
                                                backgroundColor: '#FF0033', 
                                                borderColor: '#FF0033',
                                                color: 'white',
                                                width: '100%' 
                                            }}
                                            onClick={payWithPayPayHandler}
                                            disabled={loadingPayPay} 
                                        >
                                            Pay with PayPay
                                        </Button>
                                    ) : (
                                        <div>
                                            {isPending ? <Loader /> : (
                                                <div>
                                                    <PayPalButtons
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                    ></PayPalButtons>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </ListGroup.Item>                 
                            )}

                            { loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                                        Mark As Delivered
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
            </Col>
        </Row>
    </>

  );

};

export default OrderScreen
