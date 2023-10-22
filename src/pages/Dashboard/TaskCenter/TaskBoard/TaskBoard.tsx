import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import makeRequest from '../../../../utils/makeRequest'

import TaskBoardList from './TaskBoardList/TaskBoardList'

import useUrl from '../../../../store/urls';
import useEmployee from '../../../../store/employee';
import useSelects from '../../../../store/selects';

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
  const employeeInfo = useEmployee(state => state.employeeInfo);
  const taskStatus = useSelects(state => state.taskStatus);

  const [queryObj, setQueryObj] = useState<QueryObj[]>([
    { value: 'employee', objName: '员工名称' },
    { value: 'student', objName: '学生名称' },
    { value: 'teacher', objName: '班主任名称' },
  ]);

  const [currentDuration, setCurrentDuration] = useState<number>(1);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('');
  const [currentTaskStatus, setCurrentTaskStatus] = useState<string>('请选择');

  const [keys, setKeys] = useState<string[]>(['对接员工', '任务目标', '目标数量', '状态', '截止时间']);
  const [data, setData] = useState<Pick<TaskType, 'task_id' | 'username' | 'task_target' | 'taskTargetObj_num' | 'status' | 'deadline'>[]>([]);
  useEffect(() => {
    const dateFilter = `duration=${Date.now() - currentDuration * 24 * 60 * 60 * 1000}`;
    const employeeFilter = currentEmployeeId ? `employee=${currentEmployeeId}` : '';
    const statusFilter = currentTaskStatus === '请选择' ? '' : `status=${currentTaskStatus}`;

    (async () => {
      const tasksRes = await makeRequest({
        method: 'GET',
        url: `${backendUrl}/api/v1/tasks/?${dateFilter}&${employeeFilter}&${statusFilter}`,
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
  }, [currentDuration, currentEmployeeId, currentTaskStatus]);

  return (
    <div className="taskBoard-wrapper board-component">
      <header className='taskBoard-header'>
        <h3>任务板</h3>
        <section className="taskBoard-function">
          <Link className="taskBoard-function-createFn btn-blue" to={"/dashboard/taskcenter/createtask"}>创建任务</Link>
          <ul className='taskBoard-function-filters'>
            <li className='taskBoard-function-filter'>
              <span>时间：</span>
              <select name="duration" className='form-select' onChange={(event) => setCurrentDuration(Number(event.target.value))}>
                <option value="1">今日</option>
                <option value="7">本周</option>
                <option value="30">本月</option>
                <option value="356">今年</option>
              </select>
            </li>
            <li className='taskBoard-function-filter'>
              <span>对接员工：</span>
              <select name="duration" className='form-select' onChange={(event) => setCurrentEmployeeId(event.target.value)}>
                <option value={''}>全部</option>
                {
                  employeeInfo.map(employee => {
                    return (
                      <option key={employee.user_id} value={employee.user_id}>{employee.username}</option>
                    )
                  })
                }
              </select>
            </li>
            <li className='taskBoard-function-filter'>
              <span>任务状态：</span>
              <select name="duration" className='form-select' onChange={(event) => setCurrentTaskStatus(event.target.value)}>
                {
                  taskStatus.map(item => {
                    return (
                      <option key={item} value={item}>{item}</option>
                    )
                  })
                }
              </select>
            </li>
            {/* <div className='taskBoard-function-query'>
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
              </div> */}
          </ul>
        </section>
      </header>
      <TaskBoardList keys={keys} data={data} />
    </div>
  )
}
