import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';

// stors
import useUser from './store/user';
import useUrl from './store/urls';

import { PromptProvider } from './components/Prompt/PromptContext';

// common styles
import './style/style.css'

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  // stores
  const backendUrl = useUrl(state => state.backendUrl);
  const setUserInfo = useUser(state => state.setUserInfo);

  // 使用 token 自动登录（如果有）并根据状态进行重定向
  useEffect(() => {
    (async () => {
      try {
        const loginRes = await axios.get(
          `${backendUrl}/api/v1/users/`,
          { withCredentials: true }
        )
  
        if (loginRes.status === 200 && location.pathname === '/login' || location.pathname === '/') {
          setUserInfo({
            username: loginRes.data.data.username,
            role: loginRes.data.data.role
          });
          navigate('/dashboard/workbench', {replace: true});
        };
      } catch (err: any) {
        navigate('/login');
      }
    })();
  }, []);

  return (
    <>
      <PromptProvider>
        <Outlet />
      </PromptProvider>
    </>
  )
};

export default App;