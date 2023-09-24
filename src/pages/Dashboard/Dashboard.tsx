import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import './Dashboard.css'

import Sidebar from './Sidebar/Sidebar'

export default function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 是这么一回事，如果链接为 dashboard，第三个元素就是 undefined， 如果是 dashboard/，第三个元素就是 '', 这俩都是 false，所以可以用来重定向  
    if (!location.pathname.split('/')[2]) navigate('/dashboard/workbench'); 
  }, [])

  return (
    <div className='dashboard-wrapper'>
      <Sidebar />
      <div className='dashboardContent-wrapper'>
        <Outlet />
      </div>
    </div>
  )
}
