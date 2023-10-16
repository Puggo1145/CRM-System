import { useState, useRef, FormEvent } from 'react'

import TaskContent from './TaskContent/TaskContent'
import TaskBasicData from './TaskBasicData/TaskBasicData'

import { usePrompt } from '../../../../components/Prompt/PromptContext'

import './CreateTask.css'

export default function CreateTask() {

    const { showPrompt } = usePrompt();

    const formRef = useRef<HTMLFormElement>(null);
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        
        const formData = new FormData(formRef.current as HTMLFormElement);
        const basicData: Record<string, FormDataEntryValue | null | string[]> = {
            task_name: formData.get('task_name'),
            employee: formData.get('employee'),
            deadline: formData.get('deadline'),
            task_remark: formData.get('task_remark'),
            task_target: formData.get('task_target'),
            selectedTargets: selectedTargets,
        };

        if (basicData.employee === '请选择' || basicData.deadline === '') {
            showPrompt({
                type: 'error',
                content: '请填写完整的任务基本信息', 
            })
        } else if (selectedTargets.length === 0) {
            showPrompt({
                type: 'error',
                content: '请分配任务内容',
            })
        };

        console.log(basicData);
    };

    return (
        <div className='createTask-wrapper'>
            <header className='createTask-header'>
                <h3>创建任务</h3>
            </header>
            <form onSubmit={handleSubmit} ref={formRef}>
                <section className='createTask-content'>
                    <TaskBasicData />
                    <TaskContent selectedTargets={selectedTargets} setSelectedTargets={setSelectedTargets}/>
                </section>
                <section className='board-component createTask-content-submit'>
                    <button className='btn-blue' type='submit'>提交</button>
                </section>
            </form>
        </div>
    )
}