import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation();

  //当 userInfo.name 或 userInfo.email 变化时，把 userInfo 中的 name 和 email 设置到组件的本地状态中。
  useEffect(() => {
    if (userInfo){
        setName(userInfo.name);
        setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]); //在依赖项（方括号中的内容）发生变化时重新执行。

  const submitHandler = async(e) => {
    e.preventDefault();
    if (password != confirmPassword) {
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

      <Col md={9}>Column</Col>
    </Row>
  </>
);
};

export default ProfileScreen
