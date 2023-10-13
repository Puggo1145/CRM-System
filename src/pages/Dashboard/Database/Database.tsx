import { useState } from 'react'
import PubSub from 'pubsub-js'

import CreateData from './CreateData/CreateData'

import './Database.css'



export default function Database() {

  const openCreateData = () => {
    PubSub.publish('openCreateData');
  };

  return (
    <div className='database-wrapper'>
      <CreateData />
      <header className='database-header'>
        <h2>数据库</h2>
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
            <button className='database-content-create btn-blue' onClick={openCreateData}>添加数据</button>
            <button className='database-content-create btn-blue'>导入数据</button>
          </section>
        </section>
        <div className='spacer'></div>
        
      </div>

    </div>
  )
}
