import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// stors
import useUser from './store/user';
import useEmployee from './store/employee';

// common styles
import './style/style.css'

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  // username 显示登陆状态
  const username = useUser(state => state.userInfo.username);

  // employeeInfo 显示员工信息
  const setEmployeeInfo = useEmployee(state => state.setEmployeeInfo);

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

  // 请求基本数据
  useEffect(() => {
    // 1. 检查登录
    if (!username) return;

    // 2. 请求（现在模拟）
    setEmployeeInfo([
      {_id: 'xxx1', name: '员工A'},
      {_id: 'xxx2', name: '员工B'},
      {_id: 'xxx3', name: '员工C'},
      {_id: 'xxx4', name: '员工D'},
    ])
  }, [username])

  return (
    <>
      <Outlet />
    </>
  )
}

export default App