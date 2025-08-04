import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { 
    useUpdateUserMutation, 
    useGetUserDetailsQuery,
} from "../../slices/usersApiSlice";



const UserEditScreen = () => {
  //从 URL 参数中获取 id，并重命名为 productId   解构并重命名
  const {id: userId } = useParams();

  //const [变量, 设置变量的函数] = useState(初始值);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);


  //从这个 useGetProductDetailsQuery 结果中提取几个字段：
  const { 
    data: user, 
    isLoading, 
    error, 
} = useGetUserDetailsQuery(userId);

  const [updateProduct, {isLoading: loadingUpdate}] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
    } 
  }, [user]);



    const submitHandler = async (e) => {
    e.preventDefault();
    try {
        await updateProduct({
        _id: userId,
        name,
        email,
        isAdmin,
        }).unwrap();
        toast.success('User updated successfully');
        navigate('/admin/userlist');
    } catch (err) {
        console.log('Update Error:', err); 
        toast.error(err?.data?.message || err.error || 'Update failed');
    }
    };


  return (
<>
    <Link to="/admin/userlist" className="btn btn-light my-3">
      Go Back
    </Link>

    <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}

        {isLoading ? <Loader /> : error ? (
        <Message variant="danger">
            {error?.data?.message || error?.error || 'Something went wrong'}
        </Message>
        ) : (
            //表单的提交事件应该由 <form> 控制，而不是按钮
            <Form onSubmit={ submitHandler }>
                <Form.Group controlId="name" className="my-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email" className="my-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>


              <Form.Group controlId="isAdmin" className="my-2">
                <Form.Check
                  type='checkbox'
                  label='Is Admin'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
              </Form.Group>


              {/*type="submit"，会自动触发外层 <form> 的 onSubmit。*/}
                <Button type='submit' variant='primary' className="my-2">
                    Update
                </Button>


            </Form>
        )}
    </FormContainer>
    



</> 
  );
}

export default UserEditScreen
