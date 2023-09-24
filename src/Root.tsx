import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// stors
import useUser from './store/user';

function App() {
  // username 显示登陆状态
  const username = useUser(state => state.userInfo.username);

  const navigate = useNavigate();
  const location = useLocation();

  // 重定向
  useEffect(() => {
    // 1. 用户未登录，且不在登陆页，跳转到登陆页
    if (!username && location.pathname !== '/login') {
      navigate('/login')
    // 2. 用户已登录，但是在登录页或根目录，跳转到dashboard
    } else if (username && location.pathname === '/login' || location.pathname === '/') {
      navigate('/dashboard/workbench')
    }
  }, [username])

  return (
    <>
      <Outlet />
    </>
  )
}

export default App