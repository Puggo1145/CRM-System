import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import useUser from '../../store/user';

import './Login.css'

export default function Login() {

  const navigate = useNavigate();

  const setUserInfo = useUser(state => state.setUserInfo);

  const [filledInput, setFilledInput] = useState<string[]>([]);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);


  const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { username, password } = {
      username: usernameRef.current!,
      password: passwordRef.current!
    };
    
    // 1. 检查登录信息
    if ( username.value.length === 0 || password.value.length === 0 ) {
      setFilledInput([username.value.length === 0 ? 'username' : '', password.value.length === 0 ? 'password' : '']);
      
      username.placeholder = username.value.length === 0 ? '用户名不能为空' : '请输入用户名';
      password.placeholder = password.value.length === 0 ? '密码不能为空' : '请输入密码';

      return;
    }; 

    // 2. 发送登录请求
    console.log('login');
    setUserInfo({ username: username.value});

    // 3. 登录成功，跳转到 dashboard
    navigate('/dashboard/workbench');
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
}