import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import './BoardList.css'

import { TaskType } from '../../pages/Dashboard/TaskCenter/TaskBoard/TaskBoard';

export default function BoardList({ keys, data }: { keys: string[], data: Record<string, string | number>[] }) {

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
    )
}
