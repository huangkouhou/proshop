import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { FaTimes } from 'react-icons/fa';
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation();

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  //当 userInfo.name 或 userInfo.email 变化时，把 userInfo 中的 name 和 email 设置到组件的本地状态中。
  useEffect(() => {
    if (userInfo){
        setName(userInfo.name);
        setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]); //在依赖项（方括号中的内容）发生变化时重新执行。

  const submitHandler = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast.error('Password do not match');
    } else {
        try {
          const res = await updateProfile({ 
            _id:userInfo._id, //为了让后端知道“你想修改哪一个用户的数据”
            name, 
            email, 
            password 
          }).unwrap();
          dispatch(setCredentials(res));
          toast.success('Profile updated Successfully');
        } catch (err){
            toast.error(err?.data?.message || err.error);
        }
    }
  };

return (
  <>
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password" className="my-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="my-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className="my-2">
              Update
            </Button>
            { loadingUpdateProfile && <Loader />}
        </Form>
      
      </Col>

      <Col md={9}>
        <h2>My Orders</h2>
          { isLoading ? (
            <Loader />
            ) : error ? (
            <Message>
              { error?.data?.message || error.error }
            </Message>) : (
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>
                                    {order.isPaid ? (
                                        order.paidAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{ color: 'red' }}/>
                                    )}
                                </td>

                                <td>
                                    {order.isDelivered ? (
                                        order.deliveredAt.substring(0, 10)
                                    ) : (
                                        <FaTimes style={{ color: 'red' }}/>
                                    )}
                                </td>
            {/*LinkContainer给 Bootstrap 组件加上路由跳转功能,这样点击这个按钮后，会跳转到订单详情页 /order/id 加一个判断，确保 order._id 存在才渲染跳转按钮*/}
                                <td>
                                  {order._id && (
                                    <Button
                                      as={NavLink}
                                      to={`/order/${order._id}`}
                                      className="btn-sm"
                                      variant="light"
                                    >
                                      Details
                                    </Button>
                                  )}
                                </td>


                            </tr>
                        )) }
                    </tbody>
                </Table>
          )}
      
      </Col>
    </Row>
  </>
);
};

export default ProfileScreen
