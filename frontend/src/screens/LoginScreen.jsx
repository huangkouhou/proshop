import { useState } from "react";
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from "../components/FormContainer";


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 

  const submitHandler = (e) => {
    e.preventDefault()
    console.log('submit')
  }

  return (
    <FormContainer>
       <h1>Sign In</h1>

       <Form onSubmit={submitHandler}>
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

            <Button type='submit' variant="primary" className="mt-2"> 
                Sign In
            </Button>
       </Form>
        <Row className="py-3">
            <Col>
              New Customer? <Link to='/register'>Register</Link>
            </Col>
        </Row>


    </FormContainer>
  )
}

export default LoginScreen


//{/*每次输入框内容变化时，更新 email 的状态值*/}
//{/*使用 controlId="email" 让 <Form.Label> 和 <Form.Control> 自动关联。t*/}
//{/*variant 控制的是按钮的 颜色主题（视觉样式）。"primary"	蓝色按钮:默认推荐操作*/}
//<Form.Control> 是 React-Bootstrap 提供的一个表单控件组件，用来快速生成 输入框、密码框、下拉框、文本框等 HTML 表单元素，并自动带有 Bootstrap 样式。