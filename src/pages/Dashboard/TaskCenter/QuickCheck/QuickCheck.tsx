import { useState } from "react"

import BoardList from "../../../../components/BoardList"

import './QuickCheck.css'

interface QuickCheckType {
  _id: string
  employee: string
  currentNum: string
}

export default function QuickCheck() {

  const [keys, setKeys] = useState<string[]>(['对接员工', '完成情况'])
  const [data, setData] = useState<QuickCheckType[]>([
    { _id: '1', employee: '员工A', currentNum: '8/10' },
    { _id: '2', employee: '员工B', currentNum: '5/10' },
    { _id: '3', employee: '员工C', currentNum: '10/10' },
    { _id: '4', employee: '员工D', currentNum: '10/10' },
    { _id: '5', employee: '员工E', currentNum: '10/10' },
    { _id: '6', employee: '员工E', currentNum: '10/10' },
  ])

  return (
    <div className="quickCheck-wrapper board-component">
      <header>
        <span><h3>快速审核</h3></span>
      </header>
      <BoardList keys={keys} data={data} />
    </div>
  )
}
