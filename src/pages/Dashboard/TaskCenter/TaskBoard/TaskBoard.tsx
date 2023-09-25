import { useState } from 'react'

import BoardList from '../../../../components/BoardList'

import './TaskBoard.css'

interface QueryObj {
  value: string
  objName: string
}

interface TaskType {
  _id: string
  employee: string
  target: string
  targetNum: number
  status: string
  deadline: string
}

export default function TaskBoard() {

  const [queryObj, setQueryObj] = useState<QueryObj[]>([
    { value: 'employee', objName: '员工名称' },
    { value: 'student', objName: '学生名称' },
    { value: 'teacher', objName: '班主任名称' },
  ])

  const [keys, setKeys] = useState<string[]>(['对接员工', '任务目标', '目标数量', '状态', '截止时间'])
  const [data, setData] = useState<TaskType[]>([
    { _id: '1', employee: '张三', target: '联系班主任', targetNum: 10, status: '待确认', deadline: '2021-10-10' },
    { _id: '2', employee: '李四', target: '联系学生', targetNum: 10, status: '进行中', deadline: '2021-10-10' },
    { _id: '3', employee: '王五', target: '联系学生', targetNum: 10, status: '待审核', deadline: '2021-10-10' },
    { _id: '4', employee: '张三', target: '联系班主任', targetNum: 10, status: '已完成', deadline: '2021-10-10' },
    { _id: '5', employee: '王五', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
    { _id: '6', employee: '张三', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
    { _id: '7', employee: '张三', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
    { _id: '8', employee: '张三', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
    { _id: '9', employee: '张三', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
    { _id: '10', employee: '张三', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
    { _id: '11', employee: '张三', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
    { _id: '12', employee: '张三', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
    { _id: '13', employee: '张三', target: '联系班主任', targetNum: 10, status: '已逾期', deadline: '2021-10-08' },
  ])

  return (
    <div className="taskBoard-wrapper board-component">
      <header>
        <h3>任务板</h3>
        <section className="taskBoard-function">
          <button className="taskBoard-function-createFn">创建任务</button>
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
      <BoardList keys={keys} data={data} />
    </div>
  )
}
