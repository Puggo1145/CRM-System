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
    active: boolean
}

export default function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const setUserInfo = useUser(state => state.setUserInfo);

    const [links, setLinks] = useState<Link[]>([
        {name: '工作台', path: '/dashboard/workbench', icon: [workbenchIcon, workbenchActivateIcon], active: true},
        {name: '任务中心', path: '/dashboard/taskCenter', icon: [taskCenterIcon, taskCenterActivateIcon], active: false},
        {name: '数据库', path: '/dashboard/database', icon: [databaseIcon, databaseActivateIcon], active: false},
    ]);
    const [isUserSettingShow, setIsUserSettingShow] = useState<boolean>(false);

    const handleLinkClick = (path: string) => {
        const newLinks = links.map(item => {
            item.path === path ? item.active = true : item.active = false;
            
            return item;
        })

        setLinks(newLinks);
    };

    useEffect(() => {
        handleLinkClick(location.pathname);
    }, [])

    const handleExitLogin = () => {
        // 1. 清除 user 信息
        setUserInfo({ username: '',  })
    
        // 2. 跳转到登录页面
        navigate('/login')
    };

    return (
        <nav className='sidebar-wrapper'>
            <span className='sidebar-texts'>
                <h1>樾达教育</h1>
                <p>招生信息管理系统</p>
            </span>
            <section className='sidebar-links'>
                {
                    links.map(item => {
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
                    <li onClick={handleExitLogin}>退出登录</li>
                </ul>
            </section>
        </nav>
    )
}
