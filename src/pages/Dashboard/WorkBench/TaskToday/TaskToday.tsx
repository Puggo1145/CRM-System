import { useState } from 'react'
import { Link } from 'react-router-dom';

import './TaskToday.css'

import BoardList from '../../../../components/BoardList/BoardList'

interface taskTodayDataType {
    employee: string;
    taskObject: string;
    TaskObjec_number: string;
    status: string;
}

export default function TaskToday() {

    const [dataKeys, setDataKeys] = useState<string[]>(['对接员工', '任务目标', '目标数量', '状态']);
    const [taskToday, setTaskToday] = useState<taskTodayDataType[]>([
        { employee: '员工A', taskObject: '学生A', TaskObjec_number: '学生A', status: '进行中' },
        { employee: '员工B', taskObject: '学生B', TaskObjec_number: '学生B', status: '进行中' },
        { employee: '员工C', taskObject: '学生C', TaskObjec_number: '学生C', status: '进行中' },
        { employee: '员工D', taskObject: '学生D', TaskObjec_number: '学生D', status: '进行中' },
        { employee: '员工E', taskObject: '学生E', TaskObjec_number: '学生E', status: '进行中' },
        { employee: '员工F', taskObject: '学生F', TaskObjec_number: '学生F', status: '进行中' },
        { employee: '员工G', taskObject: '学生G', TaskObjec_number: '学生G', status: '进行中' },
        { employee: '员工H', taskObject: '学生H', TaskObjec_number: '学生H', status: '进行中' },
    ]);

    return (
        <div className='taskToday-wrapper board-component'>
            <header>
                <h3>今日任务</h3>
                <span className='taskToday-btns'>
                    <Link className='btn-blue' to={"/dashboard/taskcenter"}>查看详情</Link>
                </span>
            </header>
            <BoardList keys={ dataKeys } data={ taskToday } />
        </div>
    )
}
