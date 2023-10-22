import { useState, useEffect } from 'react'
import PubSub from 'pubsub-js'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

// pages
import CreateData from './CreateData/CreateData'

import './Database.css'

export default function Database() {

  const location = useLocation();
  const navigateTo = useNavigate();

  const [isCreateDataOpened, setIsCreateDataOpened] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const [searchTimeoutId, setSearchTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
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

  // 拼接 search query
//   useEffect(() => {
//     if (!search) return;

//     if (searchTimeoutId) {
//       clearTimeout(searchTimeoutId);
//     };

//     const timeoutId = setTimeout(() => {
//       const searchQuery = search ? `?search=${search}` : '';
//       navigateTo(`${location.pathname}${location.search}${searchQuery}`, { replace: true });
//     }, 500);

//     setSearchTimeoutId(timeoutId);

//     return () => {
//       if (searchTimeoutId) {
//         clearTimeout(searchTimeoutId);
//       }
//     };
// }, [search, location.pathname]);

  // 控制添加数据的弹窗
  const openCreateData = () => {
    PubSub.publish('openCreateData');
  };

  // // 通知进入编辑模式
  // const handleEdit = () => {

  // };

  return (
    <div className='database-wrapper'>
      {isCreateDataOpened && <CreateData />}
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
            <input type="text" name='database-filter-query' placeholder='搜索功能暂不可用' onChange={(event) => setSearch(event.target.value)} />
          </section>
          <section className='database-content-crud'>
            <button className='database-content-create btn-blue' onClick={openCreateData}>快速添加</button>
            {/* <button
              className='database-content-edit btn-blue'
              style={{ backgroundColor: '#999' }}
            >编辑</button> */}
            {/* <button className='database-content-create btn-blue'>导入数据</button> */}
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
