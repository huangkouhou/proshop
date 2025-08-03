import { Outlet, Navigate } from "react-router-dom"; //Outlet 是一个占位符组件，用于渲染其父路由下的子路由组件。常用在嵌套路由中。
import { useSelector } from "react-redux";

const AdminRoute = () => {
  //从 Redux 全局状态中获取当前用户登录信息 userInfo。如果 userInfo 存在，说明用户已经登录。
  const { userInfo } = useSelector((state) => state.auth);

  //如果用户已登录，就渲染子路由 <Outlet />。如果未登录，就跳转到登录页 /login。
  return userInfo && userInfo.isAdmin ? (
    <Outlet /> // 这里就会去渲染 productlist 或 orderlist 等子页面,子路由的路径是写在 <Route> 配置中的
   ) : (
   <Navigate to='/login' replace />
   );
};

export default AdminRoute;
