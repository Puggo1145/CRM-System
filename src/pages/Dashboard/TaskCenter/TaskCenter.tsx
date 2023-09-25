
import TaskBoard from './TaskBoard/TaskBoard'
import TaskOverview from './TaskOverview/TaskOverview'
import QuickCheck from './QuickCheck/QuickCheck'

import './TaskCenter.css'

export default function TaskCenter() {
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
    </div>
  )
}
