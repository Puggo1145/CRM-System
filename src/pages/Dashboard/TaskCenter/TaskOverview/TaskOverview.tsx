import { useState, useEffect } from "react";
import makeRequest from "../../../../utils/makeRequest";

import useUrl from "../../../../store/urls";

import './TaskOverview.css'

interface overViewDataType {
    name: string
    value: number
}

export default function TaskOverview() {

    const backendUrl = useUrl(state => state.backendUrl);

    const [overViewData, setOverViewData] = useState<overViewDataType[]>([
        { name: '待确认', value: 0 },
        { name: '未对接', value: 0 },
        { name: '对接中', value: 0 },
        { name: '待审核', value: 0 },
        { name: '已完成', value: 0 },
        { name: '已逾期', value: 0 },
    ]);

    useEffect(() => {
        (async () => {
            const res = await makeRequest({
                method: "GET",
                url: `${backendUrl}/api/v1/data-analysis/task-overview`
            });

            if (!('error' in res)) {
                setOverViewData(res.data.data);
            }
        })();
    }, [])

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
