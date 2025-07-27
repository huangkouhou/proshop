import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"; //useSelector访问 Redux 中的状态
import FormContainer from "../components/FormContainer";
import Loader from '../components/Loader';
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify'; //使用 toast 弹窗提醒

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ register, { isLoading }] = useRegisterMutation();//isLoading 是由 RTK Query 提供的一个 状态标志（boolean），表示当前请求（比如 login）是否正在进行中。

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();

  //从当前页面的 URL 中提取一个查询参数 redirect，如果不存在这个参数，就默认设为 '/'
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  //一旦用户登录成功（拿到 userInfo），就自动跳转到指定页面（redirect）。
  useEffect(() => {
    if (userInfo){
        navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword){
      toast.error('Passwords do not match');
      return;
    } else {
      try{
        const res = await register({name, email, password}).unwrap();//异步 mutation 调用，会发出网络请求。unwrap如果请求成功，就直接返回真正的响应数据（通常是 res.data 的内容
        dispatch(setCredentials(...res));
        navigate(redirect);
    } catch (err){
        toast.error(err?.data?.message || err.error);
    }

    }

  }

  return (
    <FormContainer>
       <h1>Sign Up</h1>

       <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className="my-3"> 
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter email'
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email' className="my-3"> 
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password' className="my-3"> 
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword' className="my-3"> 
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                ></Form.Control>
            </Form.Group>

            <Button type='submit' variant="primary" className="mt-2"
            disabled={ isLoading }> 
                Register
            </Button>

            { isLoading && <Loader /> }

       </Form>

      {/*当用户尚未注册时，引导他们跳转到注册页，并在 URL 中携带一个 redirect 参数，方便注册成功后重定向回原先想去的页面。*/}
        <Row className="py-3">
            <Col>
              Already have an account? {}
              <Link to={ redirect ? `/login?redirect=${redirect}` : '/login' }>
              Login</Link>
            </Col>
        </Row>


    </FormContainer>
  )
}

export default RegisterScreen;


// const location = useLocation();

// console.log(location.pathname);   // 当前路径，如 /login
// console.log(location.search);     // 查询字符串，如 ?redirect=/shipping
// console.log(location.hash);       // URL 中的 # 部分（锚点）
// console.log(location.state);      // 通过 Link 传递的 state（对象）



//使用 controlId="email" 让 <Form.Label> 和 <Form.Control> 自动关联。
//variant 控制的是按钮的 颜色主题（视觉样式）。"primary"	蓝色按钮:默认推荐操作
//<Form.Control> 是 React-Bootstrap 提供的一个表单控件组件，用来快速生成 输入框、密码框、下拉框、文本框等 HTML 表单元素，并自动带有 Bootstrap 样式。