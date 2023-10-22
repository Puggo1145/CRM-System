import { useState, useEffect } from "react"
import makeRequest from "../../../../utils/makeRequest"

import useUrl from "../../../../store/urls"

import BoardList from "../../../../components/BoardList/BoardList"

import { TaskType } from "../TaskBoard/TaskBoard"

import './QuickCheck.css'

interface QuickCheckType {
  [key: string]: string
  task_id: string
  username: string
  currentNum: string
}

export default function QuickCheck() {

  const backendUrl = useUrl(state => state.backendUrl);
  useEffect(() => {
    (async () => {
      const res = await makeRequest({
        method: 'GET',
        url: `${backendUrl}/api/v1/data-analysis/quick-check`
      });

      if (!('error' in res)) {
        setData((res.data.data.map((item: { task_id: string; username: string; finishedTaskTarget: number; taskTargetObj_num: number }) => {
          return {
            task_id: item.task_id,
            username: item.username,
            currentNum: `${item.finishedTaskTarget}/${item.taskTargetObj_num}`
          }
        }
        )));
      }
    })();
  }, []);

  const [keys] = useState<string[]>(['对接员工', '完成情况'])
  const [data, setData] = useState<QuickCheckType[]>([
    
  ])

  return (
    <div className="quickCheck-wrapper board-component">
      <header className="quickCheck-header">
        <span><h3>快速审核</h3></span>
      </header>
      <BoardList keys={keys} data={data} />
    </div>
  )
}
