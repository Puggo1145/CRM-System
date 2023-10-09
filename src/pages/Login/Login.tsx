import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import useUser from '../../store/user';
import useUrl from '../../store/urls';

import { usePrompt } from '../../components/Prompt/PromptContext';

import './Login.css'

export default function Login() {

  const navigate = useNavigate();

  const { showPrompt } = usePrompt();

  const setUserInfo = useUser(state => state.setUserInfo);
  const backendUrl = useUrl(state => state.backendUrl);

  const [filledInput, setFilledInput] = useState<string[]>([]);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);


  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { username, password } = {
      username: usernameRef.current!.value,
      password: passwordRef.current!.value
    };

    // 检查登录信息
    if (username.length === 0 || password.length === 0) {
      setFilledInput([username.length === 0 ? 'username' : '', password.length === 0 ? 'password' : '']);

      usernameRef.current!.placeholder = username.length === 0 ? '用户名不能为空' : '请输入用户名';
      passwordRef.current!.placeholder = password.length === 0 ? '密码不能为空' : '请输入密码';

      return;
    };

    try {
      const loginRes = await axios.post(
        `${backendUrl}/api/v1/users/login`,
        {
          username: username,
          password: password
        },
        { withCredentials: true }
      );

      if (loginRes.status === 200) {
        setUserInfo({
          username: loginRes.data.username,
          role: loginRes.data.role
        });

        navigate('/dashboard/workbench');
      }
    } catch (err: any) {
      if (err.response.status === 401) {
        showPrompt({
          content: err.response.data.message,
          type: 'error'
        });
      }; 
    };
  };

  const handleRefocus = (inputName: string) => {
    setFilledInput(filledInput.filter(item => item !== inputName));
    inputName === 'username' ? usernameRef.current!.placeholder = '请输入用户名' : passwordRef.current!.placeholder = '请输入密码';
  };

  return (
    <div className='login-wrapper'>
      <div className='login-board'>
        <h1 className='login-board-title'>樾达教育信息管理系统</h1>
        <form>
          <section className='login-board-inputs'>
            <input
              className={!filledInput.includes('username') ? '' : 'login-board-unpass'}
              ref={usernameRef} type="username"
              placeholder='请输入用户名'
              onFocus={() => handleRefocus('username')}
            />
            <input
              className={!filledInput.includes('password') ? '' : 'login-board-unpass'}
              ref={passwordRef}
              type="password"
              placeholder='请输入密码'
              onFocus={() => handleRefocus('password')}
            />
          </section>
          <button className='login-board-submit' onClick={(event) => handleSubmit(event)}>登录</button>
        </form>
      </div>
    </div>
  )
};