import { useState, useEffect } from 'react'
import PubSub from 'pubsub-js'

// components
import BackgroundMask from '../../../../components/BackgroundMask/BackgroundMask'

// stores
import useEmployee from '../../../../store/employee'

// utils
import { handleComponentOpen } from '../../../../utils/handleComponentOpen'

import './CreateTask.css'

export default function CreateTask() {

    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState<boolean>(false)

    useEffect(() => {
      const token = PubSub.subscribe('createTask', () => {
        setIsCreateTaskOpen(!isCreateTaskOpen)
      });
  
      return () => {
        PubSub.unsubscribe(token)
      }
    }, [isCreateTaskOpen])

    // 选择员工
    const employee = useEmployee(state => state.employeeInfo)

    // 任务目标
    const [target, setTarget] = useState<string[]>(['对接班主任', '对接学生'])

    return (
        <>
            <div className={isCreateTaskOpen ? 'createTask-wrapper taskOpen' : 'createTask-wrapper'}>
                <header>
                    <h3>创建任务</h3>
                    <button className='createTask-close' onClick={() => handleComponentOpen('createTask')}></button>
                </header>
                <main>
                    <form>
                        <section className='createTask-employee'>
                            <label htmlFor='employee'>员工</label>
                            <select className='formBezel' name="employee">
                                {
                                    employee.map(item => {
                                        return (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </section>
                        <section className='createTaks-target'>
                            <label htmlFor="target">任务目标</label>
                            <select className='formBezel' name='target'>
                                {
                                    target.map((item, index) => {
                                        return (
                                            <option key={index} value={item}>{item}</option>
                                        )
                                    })
                                }
                            </select>
                        </section>
                        <section>
                            <label htmlFor="taskContent">任务内容</label>
                            <div className='createTask-taskContent formBezel'></div>
                        </section>
                        <section className='createTask-deadline'>
                            <label htmlFor="deadline">截止时间</label>
                            <input type="datetime-local" name="deadline" className='formBezel timePicker'/>
                        </section>
                        <section>
                            <label htmlFor="taskDesc">备注</label>
                            <textarea name="taskContent" className='formBezel'></textarea>
                        </section>
                    </form>
                </main>
                <footer>
                    <button className='createTask-confirm btn-blue'>创建</button>
                </footer>
            </div>
            <BackgroundMask onClick={() => handleComponentOpen('createTask')} state={isCreateTaskOpen}/>
            {/* <div className='background-mask' onClick={() => handleComponentOpen('createTask')} style={{}}></div> */}
        </>
    )
}