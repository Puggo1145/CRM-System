import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import makeRequest from '../../../../utils/makeRequest'

import TaskBoardList from './TaskBoardList/TaskBoardList'

import useUrl from '../../../../store/urls'

import './TaskBoard.css'

interface QueryObj {
  value: string
  objName: string
}

export interface TaskType {
  [key: string]: string | number | undefined;
  task_id: string
  task_name?: string
  employee: string
  username?: string // 员工的名字
  task_remark?: string
  task_target: string
  taskTargetObj_num: number
  
  status: string
  
  deadline: string
  create_time: string
}

export default function TaskBoard() {

  const backendUrl = useUrl(state => state.backendUrl);

  const [queryObj, setQueryObj] = useState<QueryObj[]>([
    { value: 'employee', objName: '员工名称' },
    { value: 'student', objName: '学生名称' },
    { value: 'teacher', objName: '班主任名称' },
  ]);

  const [keys, setKeys] = useState<string[]>(['对接员工', '任务目标', '目标数量', '状态', '截止时间']);
  
  const [data, setData] = useState<Pick<TaskType, 'task_id' | 'username' | 'task_target' | 'taskTargetObj_num' | 'status' | 'deadline' >[]>([]);
  useEffect(() => {
    (async () => {
      const tasksRes = await makeRequest({
        method: 'GET',
        url: `${backendUrl}/api/v1/tasks/?select=task_id,task_target,status,deadline,username`,
      });

      if (!('error' in tasksRes)) {
        const tasks = tasksRes.data.data as TaskType[];
        const transformedTasks = tasks.map(task => {
          return {  
            task_id: task.task_id,
            username: task.username,
            task_target: task.task_target,
            taskTargetObj_num: task.taskTargetObj_num,
            status: task.status,
            deadline: task.deadline
          }
        });

        setData(transformedTasks);
      } 
    })();
  }, []);

  return (
      <div className="taskBoard-wrapper board-component">
        <header className='taskBoard-header'>
          <h3>任务板</h3>
          <section className="taskBoard-function">
            <Link className="taskBoard-function-createFn btn-blue" to={"/dashboard/taskcenter/createtask"}>创建任务</Link>
            <section className='taskBoard-function-filters'>
              <select name="duration" className='taskBoard-function-duration'>
                <option value="today">今日</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
                <option value="year">今年</option>
              </select>
              <div className='taskBoard-function-query'>
                <select name="queryForSelect">
                  {
                    queryObj.map(item => {
                      return (
                        <option key={item.value} value={item.value}>{item.objName}</option>
                      )
                    })
                  }
                </select>
                <input type="text" name='queryForInput' placeholder='请输入' />
                <span className='queryFor-desc'></span>
              </div>
            </section>
          </section>
        </header>
        <TaskBoardList keys={keys} data={data} />
      </div>
  )
}
