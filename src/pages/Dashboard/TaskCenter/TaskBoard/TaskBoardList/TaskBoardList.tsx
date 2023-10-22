import { Link } from 'react-router-dom';
import { taskStatusColor } from '../../../../../utils/handleStatusColor';

import '../../../../../components/BoardList/BoardList.css'

import { TaskType } from '../TaskBoard';

export default function TaskBoardList({ keys, data }: { keys: string[], data: Partial<TaskType>[] }) {

    return (
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
                                <Link key={item.task_id} className='boardList-content-item' to={`/dashboard/taskcenter/${item.task_id}`}>
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
    )
}
