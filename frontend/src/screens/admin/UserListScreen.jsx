import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from 'react-toastify';
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async(id) => {
    if (window.confirm('Are you sure?')) {
      try {
      await deleteUser(id).unwrap();  // 解包返回值，方便 catch 错误
      toast.success('User deleted successfully'); // ✅ 添加成功提示
      refetch();  // 你现在手动刷新列表（如果没用 invalidatesTags）
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return(
    <>
      <h1>Users</h1>
      { loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive
        className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td><a href={`mailto:${user.email}`}>{ user.email }</a></td>
                  
                  {/*在使用 .substring() 前确保字段存在, 双重判断：只有 isPaid 为 true 且 paidAt 不为空时，才执行 substring。否则就渲染红色叉号。*/}
                  <td>
                    {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                    ) : (
                    <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>

                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant='light' className="btn-sm">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTrash style={{ color: 'white' }}/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
        </Table>
      )}
    </>
  );

}

export default UserListScreen;

