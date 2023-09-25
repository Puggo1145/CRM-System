import { useState } from 'react'

import Topemployee from './TopEmployee/TopEmployee';
import WorkTrend from './WorkTrend/WorkTrend';
import MyCustomer from './MyCustomer/MyCustomer';
import TaskToday from './TaskToday/TaskToday';

import './Workbench.css'

interface generalDataType {
  title: string;
  value: number;
  comparation?: number;
}

export default function Workbench() {

  const [updatedAt, setUpdatedAt] = useState<string>('2023-09-22 12:00:00')
  const [currentObj, setCurrentObj] = useState<number>(0) // 0: 班主任， 1: 学生

  const [generalData, setGeneralData] = useState<generalDataType[]>([
    { title: '今日新增招生', value: 24, comparation: 0.12 },
    { title: '本周新增招生', value: 74, comparation: 0.36 },
    { title: '累计招生', value: 456 },
    { title: '本月目标', value: 120 },
  ]);

  const handleObjSwitch = (objName: number) => {
    setCurrentObj(objName);
  }

  return (
    <div className='workbench-wrapper'>
      <header className='workbench-header'>
        <span className='workbench-header-title'>
          <h2>实时概况</h2>
          <span className='workbench-header-desc'>更新时间：{updatedAt}</span>
        </span>
        <span className='workbench-header-switchObj'>
          <span className='workbench-header-desc'>切换查看对象：</span>
          <ul className='workbench-header-switcher'>
            <li className={currentObj === 0 ? 'workbench-activeObj' : ''} onClick={() => handleObjSwitch(0)}>班主任</li>
            <li className={currentObj === 1 ? 'workbench-activeObj' : ''} onClick={() => handleObjSwitch(1)}>学生</li>
          </ul>
        </span>
      </header>

      <div className='workbench-content'>
        {
          generalData.map(item => {
            return (
              <div key={item.title} className='workbench-generalData-item'>
                <span className='workbench-generalData-item-title'>{item.title}</span>
                <span className='workbench-generalData-item-value'>{item.value}</span>
                {
                  item.comparation &&
                  <span
                    className='workbench-generalData-item-comparation'
                    style={{
                      color: item.comparation > 0 ? '#30CB5B' : '#FF8A00',
                      backgroundColor: item.comparation > 0 ? '#C9FFD8' : '#FFDBB1',
                    }}
                  >
                    {item.comparation}
                  </span>
                }
              </div>
            )
          })
        }
        <Topemployee />
        <WorkTrend />
        <MyCustomer />
        <TaskToday />
      </div>
    </div>
  )
}
