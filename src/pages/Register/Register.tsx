import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { usePrompt } from '../../components/Prompt/PromptContext';

import useUrl from '../../store/urls';
import useUser from '../../store/user';

import './Register.css';

export default function Register() {

    const navigateTo = useNavigate();
    const { showPrompt } = usePrompt();

    const backendUrl = useUrl(state => state.backendUrl);
    const setUserInfo = useUser(state => state.setUserInfo);

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const doubleCheckPasswordRef = useRef<HTMLInputElement>(null);

    const backToLogin = () => {
        navigateTo('/login');
    }

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const { username, password, doubleCheckPassword } = {
            username: usernameRef.current!.value,
            password: passwordRef.current!.value,
            doubleCheckPassword: doubleCheckPasswordRef.current!.value
        };

        if (username.length === 0 || password.length === 0 || doubleCheckPassword.length === 0) {
            usernameRef.current!.placeholder = username.length === 0 ? '用户名不能为空' : '请输入用户名';
            passwordRef.current!.placeholder = password.length === 0 ? '密码不能为空' : '请输入密码';
            doubleCheckPasswordRef.current!.placeholder = doubleCheckPassword.length === 0 ? '密码不能为空' : '请再次输入密码';

            return;
        };
        if (password !== doubleCheckPassword) {
            passwordRef.current!.value = '';
            doubleCheckPasswordRef.current!.value = '';
            passwordRef.current!.placeholder = '两次密码不一致';
            doubleCheckPasswordRef.current!.placeholder = '两次密码不一致';

            return;
        };

        try {
            const registerRes = await axios.post(`${backendUrl}/api/v1/users/register`, {
                username: username,
                password: password
            },
                { withCredentials: true }
            );

            if (registerRes.status === 201) {
                showPrompt({ content: "注册成功", type: 'success' })

                setUserInfo({
                    username: registerRes.data.data.username,
                    role: registerRes.data.data.role
                });

                navigateTo('/dashboard/workbench');
            };
        } catch (err: any) {
            if (err.response.status === 400) {
                showPrompt({
                    content: err.response.data.message,
                    type: 'error'
                });
            };
        }

    };

    return (
        <div className="register-wrapper">
            <button className='register-back' onClick={backToLogin}></button>
            <h2>注册</h2>
            <form>
                <section className='register-inputs'>
                    <input ref={usernameRef} type="text" className='register-input' placeholder='请输入真实姓名' />
                    <input ref={passwordRef} type="password" className='register-input' placeholder='请输入密码' />
                    <input ref={doubleCheckPasswordRef} type="password" className='register-input' placeholder='请再次输入密码' />
                </section>
            </form>
            <button className='board-button' type='button' onClick={(event) => handleSubmit(event)}>注册</button>
        </div>
    )
};