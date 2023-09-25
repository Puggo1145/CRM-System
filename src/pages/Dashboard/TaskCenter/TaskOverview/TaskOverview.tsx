import { useState } from "react"

import './TaskOverview.css'

interface overViewDataType {
    name: string
    value: number
}

export default function TaskOverview() {

    const [overViewData, setOverViewData] = useState<overViewDataType[]>([
        {name: '总对接数', value: 1564},
        {name: '未对接', value: 224},
        {name: '对接成功', value: 1055},
        {name: '对接失败', value: 285}
    ])

    return (
        <div className="taskOverview-wrapper board-component">
            <header>
                <span><h3>任务总览</h3></span>
            </header>
            <ul className="taskOverview-content">
                {
                    overViewData.map(item => {
                        return (
                            <li key={item.name} className="taskOverview-content-item">
                                <span>{item.name}</span>
                                <span>{item.value}</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
