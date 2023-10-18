import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import makeRequest from './utils/makeRequest';

// stors
import useUser from './store/user';
import useUrl from './store/urls';
import useEmployee from './store/employee';

import { PromptProvider } from './components/prompts/PromptContext';

// common styles
import './style/style.css'

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  // stores
  const backendUrl = useUrl(state => state.backendUrl);
  const [userInfo, setUserInfo] = useUser(state => [state.userInfo, state.setUserInfo]);
  const setEmployeeInfo = useEmployee(state => state.setEmployeeInfo);

  // 使用 token 自动登录（如果有）并根据状态进行重定向
  useEffect(() => {
    (async () => {
      getLoginStatus();
    })();
  }, []);

  // 获取登录信息并鉴权
  const getLoginStatus = async () => {
    const loginRes = await makeRequest({
      method: 'GET',
      url: `${backendUrl}/api/v1/users/`,
    });

    if (('error' in loginRes)) return navigate('/login');
    
    setUserInfo({
      username: loginRes.data.data.username,
      role: loginRes.data.data.role
    });
    
    navigate('/dashboard/workbench', { replace: true });

  };

  // 获取员工信息
  const getEmployees = async () => {
    const res = await makeRequest({
      method: 'GET',
      url: `${backendUrl}/api/v1/data/getAllemployees`,
    });

    if (!('error' in res)) {
      setEmployeeInfo(res.data.data);
    }
  };
  useEffect(() => {
    if (userInfo.role === 'admin') getEmployees();
  }, [userInfo]);

  return (
    <>
      <PromptProvider>
        <Outlet />
      </PromptProvider>
    </>
  )
};

export default App;