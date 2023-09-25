
import TaskBoard from './TaskBoard/TaskBoard'
import TaskOverview from './TaskOverview/TaskOverview'
import QuickCheck from './QuickCheck/QuickCheck'
import HandleOverdue from './HandleOverdue/HandleOverdue'

import './TaskCenter.css'

export default function TaskCenter() {
  return (
    <div className='taskCenter-wrapper'>
      <header>
        <span><h2>任务中心</h2></span>
      </header>

      <div className='taskCenter-content'>
        <section className='taskCenter-content-left'>
          <TaskBoard />
        </section>
        <section className='taskCenter-content-right'>
          <TaskOverview />
          <QuickCheck />
          <HandleOverdue />
        </section>
      </div>
    </div>
  )
}
