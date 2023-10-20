import { useState, useEffect } from 'react';
import makeRequest from '../../../utils/makeRequest';
import { Link, Outlet } from 'react-router-dom';

import useUrl from '../../../store/urls';

import { TaskType } from '../TaskCenter/TaskBoard/TaskBoard';

import './MyTask.css';

export default function Mytask() {

  const backendUrl = useUrl(state => state.backendUrl);

  const [keys, setKeys] = useState<string[]>(['任务目标', '目标数量', '状态', '截止时间']);
  const [data, setData] = useState<Pick<TaskType, 'task_id' | 'task_target' | 'taskTargetObj_num' | 'status' | 'deadline'>[]>([]);
  useEffect(() => {
    (async () => {
      const tasksRes = await makeRequest({
        method: 'GET',
        url: `${backendUrl}/api/v1/tasks/employee`,
      });

      if (!('error' in tasksRes)) {
        console.log(tasksRes.data.data);
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
  }, [])

  const handleStatusColor = (status: string) => {
    switch (status) {
      case '待确认':
        return '#6C6C6C'
      case '进行中':
        return '#FF8A00'
      case '待审核':
        return '#3963EB'
      case '已完成':
        return '#30CB5B'
      case '已逾期':
        return '#DE1F1F'
      default:
        return ''
    }
  };

  return (
    <div className='mytask-wrapper'>
      <header>
        <h3>我的任务</h3>
      </header>
      <section className='mytask-content board-component'>
        <section className='mytask-filters'>
          <span>按时间筛选：</span>
          <select name="duration" className='form-select'>
            <option value="today">今日</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="year">今年</option>
          </select>
        </section>
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
                                  style={key === 'status' ? { color: handleStatusColor(value as string) } : {}}
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
