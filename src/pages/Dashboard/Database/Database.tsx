import { useState, useEffect } from 'react'
import PubSub from 'pubsub-js'
import { Link, Outlet, useLocation } from 'react-router-dom'

// pages
import CreateData from './CreateData/CreateData'

import './Database.css'

export default function Database() {

  const location = useLocation();

  const [isCreateDataOpened, setIsCreateDataOpened] = useState<boolean>(false);

  useEffect(() => {
    const tokenA = PubSub.subscribe('openCreateData', () => {
      setIsCreateDataOpened(!isCreateDataOpened);
    });
    const refreshToken = PubSub.subscribe('refresh', () => {
      window.location.reload();
    });

    return () => {
      PubSub.unsubscribe(tokenA);
      PubSub.unsubscribe(refreshToken);
    };
  }, [isCreateDataOpened]);

  // 控制添加数据的弹窗
  const openCreateData = () => {    
    PubSub.publish('openCreateData');
  };

  return (
    <div className='database-wrapper'>
      { isCreateDataOpened && <CreateData /> }
      <header>
        <Link to={"/dashboard/database"}>数据库</Link>
        {
          location.pathname.split('/').toSpliced(0, 3).map((path, index) => {
            
            return (
              <a 
                key={index} 
                onClick={() => history.go(index + 1 - location.pathname.split('/').toSpliced(0, 3).length)}
              >{'/' + decodeURIComponent(path)}</a>
            )
          })
        }
      </header>

      <div className='database-content board-component'>
        <header>
          <h3>数据库</h3>
        </header>

        <section className='database-content-functions'>
          <section className='database-content-filter'>
            <input type="text" name='database-filter-query' placeholder='请输入要查询的内容' />
          </section>
          <section className='database-content-crud'>
            <button className='database-content-create btn-blue' onClick={openCreateData}>快速添加</button>
            <button className='database-content-create btn-blue'>导入数据</button>
          </section>
        </section>
        <div className='spacer'></div>
        <section className='database-content-schools'>
          {<Outlet />}  
        </section>
      </div>

    </div>
  )
}
