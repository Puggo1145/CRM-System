import cookie from 'react-cookies';
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import useUser from '../../../store/user'

import workbenchIcon from '../../../static/dashboard/sidebar/workbench.png'
import workbenchActivateIcon from '../../../static/dashboard/sidebar/workbench-activate.png'
import taskCenterIcon from '../../../static/dashboard/sidebar/taskCenter.png'
import taskCenterActivateIcon from '../../../static/dashboard/sidebar/taskCenter-activate.png'
import databaseIcon from '../../../static/dashboard/sidebar/database.png'
import databaseActivateIcon from '../../../static/dashboard/sidebar/database-activate.png'

import testAvatar from '../../../static/dashboard/sidebar/test_avatar.png'

import './Sidebar.css'

interface Link {
    name: string,
    path: string,
    icon: string[],
    active: boolean,
    authority: string[]
}

export default function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useUser(state => [state.userInfo, state.setUserInfo]);

    const [links, setLinks] = useState<Link[]>([
        {name: '工作台', path: '/dashboard/workbench', icon: [workbenchIcon, workbenchActivateIcon], active: true, authority: ['admin']},
        {name: '任务中心', path: '/dashboard/taskcenter', icon: [taskCenterIcon, taskCenterActivateIcon], active: false,  authority: ['admin']},
        {name: '数据库', path: '/dashboard/database', icon: [databaseIcon, databaseActivateIcon], active: false, authority: ['admin']},
        {name: '我的任务', path: '/dashboard/mytask', icon: [taskCenterIcon, taskCenterActivateIcon], active: false,  authority: ['employee']}
    ]);
    const [isUserSettingShow, setIsUserSettingShow] = useState<boolean>(false);

    const handleLinkClick = (path: string) => {
        const newLinks = links.map(item => {
            item.path === path ? item.active = true : item.active = false;
            
            return item;
        })

        setLinks(newLinks);
    };

    // 根据 url 同步 sidebar 的 active 状态
    useEffect(() => {
        handleLinkClick(location.pathname);
    }, [location.pathname])

    const handleExitLogin = () => {
        // 1. 清除 user 信息
        setUserInfo({ username: '',  })

        // 2. 清除 cookie
        cookie.remove('jwt');
    
        // 3. 跳转到登录页面
        navigate('/login')
    };

    return (
        <nav className='sidebar-wrapper'>
            <span className='sidebar-texts'>
                <h1>樾达教育科技</h1>
                <p>信息管理系统</p>
            </span>
            <section className='sidebar-links'>
                {
                    links.filter(item => item.authority.includes(userInfo.role!)).map(item => {
                        return (
                            <Link 
                                key={item.name}
                                className={item.active ? 'sidebar-link sidebar-link-activate' : 'sidebar-link'} 
                                to={item.path} 
                                style={{ backgroundImage: `url(${item.icon[item.active ? 1 : 0]})` }}
                                onClick={() => handleLinkClick(item.path)}
                            />
                        )
                    }) 
                }
            </section>
            <section className='sidebar-user'>
                <img 
                    className='sidebar-user-avatar' 
                    src={testAvatar} 
                    onClick={() => setIsUserSettingShow(!isUserSettingShow)}
                />
                <ul className='sidebar-user-setting' style={{ display: isUserSettingShow ? 'block' : 'none' }}>
                    <li>用户名：{userInfo.username}</li>
                    <li>权限：{userInfo.role === 'admin' ? '管理员' : '员工'}</li>
                    <li onClick={handleExitLogin} className='sidebar-user-setting-fn'>退出登录</li>
                </ul>
            </section>
        </nav>
    )
}
