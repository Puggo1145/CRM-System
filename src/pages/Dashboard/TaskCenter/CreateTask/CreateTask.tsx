import { useState, useEffect } from 'react'

import TaskContent from './TaskContent/TaskContent'
import TaskBasicData from './TaskBasicData/TaskBasicData'

import './CreateTask.css'

export default function CreateTask() {

    return (
        <div className='createTask-wrapper'>
            <header className='createTask-header'>
                <h3>创建任务</h3>
            </header>
            <section className='createTask-content'>
                <TaskBasicData />
                <TaskContent />
            </section>
            <section className='board-component createTask-content-submit'>
                <button className='btn-blue' type='submit'>提交</button>
            </section>
        </div>
    )
}