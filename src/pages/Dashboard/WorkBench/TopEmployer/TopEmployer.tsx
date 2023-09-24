import { useState } from 'react'

import './TopEmployer.css'

interface TopEmployerDataType {
    rank: number;
    name: string;
    performance: number;
}

export default function TopEmployer() {

    const [TopEmployers, setTopEmployers] = useState<TopEmployerDataType[]>([
        {rank: 1, name: '张三', performance: 24},
        {rank: 2, name: '李四', performance: 20},
        {rank: 3, name: '王五', performance: 17},
        {rank: 4, name: '赵六', performance: 16},
        {rank: 5, name: '田七', performance: 15},
        {rank: 6, name: '周八', performance: 14},
    ]);

    return (
        <div className="topEm-wrapper">
            <header>
                <h3>Top 员工业绩</h3>
                <select name="duration">
                    <option value="day">今日</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                </select>
            </header>
            <div className='topEm-list'>
                <section className='topEm-list-headerRow'>
                    <span>排名</span>
                    <span>员工</span>
                    <span>业绩</span>
                </section>
                <ul className='topEm-list-content'>
                    {
                        TopEmployers.map(item => {
                            return (
                                <li key={item.rank} className='topEm-list-content-item'>
                                    <span className='topEm-list-content-item-rank'>{item.rank}</span>
                                    <span className='topEm-list-content-item-name'>{item.name}</span>
                                    <span  className='topEm-list-content-item-performance'>{item.performance}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}
