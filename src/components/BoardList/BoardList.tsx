import { Link } from 'react-router-dom';

import { taskStatusColor } from '../../utils/handleStatusColor';

import './BoardList.css'

export default function BoardList({ keys, data }: { keys: string[], data: Record<string, string | number>[] }) {

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
                        data.map((item, index) => {
                            return (
                                <Link key={'item' + index} className='boardList-content-item' to={""}>
                                    {
                                        Object.entries(item)
                                            .filter(([key]) => key.split('_')[1] !== 'id') // 过滤掉_id
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
