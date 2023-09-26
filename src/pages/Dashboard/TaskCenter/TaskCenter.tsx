import { useState, useEffect } from 'react'
import PubSub from 'pubsub-js'

import TaskBoard from './TaskBoard/TaskBoard'
import TaskOverview from './TaskOverview/TaskOverview'
import QuickCheck from './QuickCheck/QuickCheck'

import CreateTask from './CreateTask/CreateTask'

import './TaskCenter.css'

export default function TaskCenter() {
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState<boolean>(false)

  useEffect(() => {
    const token = PubSub.subscribe('createTask', () => {
      setIsCreateTaskOpen(!isCreateTaskOpen)
    });

    return () => {
      PubSub.unsubscribe(token)
    }
  }, [isCreateTaskOpen])

  return (
    <div className='taskCenter-wrapper'>
      <header className='taskCenter-header'>
        <span><h2>任务中心</h2></span>
      </header>

      <div className='taskCenter-content'>
        <TaskBoard />
        <section className='taskCenter-content-right'>
          <TaskOverview />
          <QuickCheck />
        </section>
      </div>

      <section className='taskCenter-components'>
        {
          isCreateTaskOpen && <CreateTask />
        }
      </section>
    </div>
  )
}
