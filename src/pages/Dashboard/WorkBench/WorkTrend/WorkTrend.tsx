import { useState } from 'react'

import './WorkTrend.css'

interface WorkTrendDataType {
    name: string;
    value: number;
}

export default function WorkTrend() {
    
    const [workTrendData, setWorkTrendData] = useState<WorkTrendDataType[]>([
        {name: '对接成功', value: 410},
        {name: '总对接数', value: 621},
        {name: '对接成功率', value: 0.66}
    ]);

    return (
        <div className="workTrend-wrapper board-component">
            <header>
                <h3>工作趋势</h3>
                <select name="duration"  className='duration'>
                    <option value="day">今日</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                </select>
            </header>
            <ul className='workTrend-data'>
                {
                    workTrendData.map(item => {
                        return (
                            <li key={item.name} className='workTrend-data-item'>
                                <span className='workTrend-data-item-name'>{item.name}</span>
                                <span className='workTrend-data-item-value'>{ item.value < 1 ? `${item.value*100}%` : item.value }</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
