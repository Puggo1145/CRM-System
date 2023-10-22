import { useState, useEffect } from 'react';
import makeRequest from '../../../utils/makeRequest';
import { Link } from 'react-router-dom';

import { taskStatusColor } from '../../../utils/handleStatusColor';

import useUrl from '../../../store/urls';
import useSelects from '../../../store/selects';

import { TaskType } from '../TaskCenter/TaskBoard/TaskBoard';

import './MyTask.css';

export default function Mytask() {

  const backendUrl = useUrl(state => state.backendUrl);
  const { taskStatus } = useSelects(state => state);

  const [currentDuration, setCurrentDuration] = useState<number>(1);
  const [currentTaskStatus, setCurrentTaskStatus] = useState<string>('请选择');

  const [keys, setKeys] = useState<string[]>(['任务目标', '目标数量', '状态', '截止时间']);
  const [data, setData] = useState<Pick<TaskType, 'task_id' | 'task_target' | 'taskTargetObj_num' | 'status' | 'deadline'>[]>([]);
  useEffect(() => {
    (async () => {
      const dateFilter = `duration=${Date.now() - currentDuration * 24 * 60 * 60 * 1000}`;
      const taskStatusFilter = currentTaskStatus !== "请选择" ? `status=${currentTaskStatus}` : '';

      const tasksRes = await makeRequest({
        method: 'GET',
        url: `${backendUrl}/api/v1/tasks/employee?${taskStatusFilter}&${dateFilter}`,
      });

      if (!('error' in tasksRes)) {
        const tasks = tasksRes.data.data as TaskType[];
        const transformedTasks = tasks.map(task => {
          return {
            task_id: task.task_id,
            task_target: task.task_target,
            taskTargetObj_num: task.taskTargetObj_num,
            status: task.status,
            deadline: task.deadline
          }
        });
        setData(transformedTasks);
      }
    })();
  }, [currentTaskStatus, currentDuration])

  return (
    <div className='mytask-wrapper'>
      <header>
        <h3>我的任务</h3>
      </header>
      <section className='mytask-content board-component'>
        <ul className='mytask-filters'>
          <li className='mytask-filters-item'>
            <span>按时间筛选：</span>
            <select name="duration" className='form-select' onChange={(event) => setCurrentDuration(Number(event.target.value))}>
              <option value="1">今日</option>
              <option value="7">本周</option>
              <option value="30">本月</option>
              <option value="356">今年</option>
            </select>
          </li>
          <li className='mytask-filters-item'>
            <span>按状态筛选：</span>
            <select name="duration" className='form-select' onChange={(event) => setCurrentTaskStatus(event.target.value)}>
              {
                taskStatus.map((item, index) => {
                  return (
                    <option key={'item' + index} value={item}>{item}</option>
                  )
                })
              }
            </select>
          </li>
        </ul>
        <>
          <ul className='boardList'>
            <li className='boardList-headerRow'>
              {
                keys.map((item, index) => {
                  return (
                    <span key={'item' + index}>{item}</span>
                  )
                })
              }
            </li>
            <div className='boardList-content'>
              {
                data.length === 0 ? <span className='boardList-noData'>暂无任务</span> :
                  data.map((item, index) => {
                    return (
                      <Link key={item.task_id} className='boardList-content-item' to={`/dashboard/mytask/${item.task_id}`}>
                        {
                          Object.entries(item)
                            .filter(([key]) => key !== 'task_id') // 过滤掉_id
                            .map(([key, value], idx) => {
                              return (
                                <span
                                  key={`item-${index}-${idx}`}
                                  style={key === 'status' ? { color: taskStatusColor(value as string) } : {}}
                                >
                                  {
                                    key === 'create_time' || key === 'deadline' ?
                                      new Date(Number(value)).toLocaleDateString() :
                                      value
                                  }
                                </span>
                              );
                            })
                        }
                      </Link>
                    )
                  })
              }
            </div>
          </ul>
        </>
      </section>
    </div>
  )
}
