import { useState, useRef, FormEvent } from 'react'
import makeRequest from '../../../../utils/makeRequest'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import TaskContent from './TaskContent/TaskContent'
import TaskBasicData from './TaskBasicData/TaskBasicData'

import useUrl from '../../../../store/urls'

import { usePrompt } from '../../../../components/Prompt/PromptContext'

import './CreateTask.css'

import backIcon from '../../../../static/common/back.png'

export default function CreateTask() {

    const navigateTo = useNavigate();
    const { showPrompt } = usePrompt();

    const backendUrl = useUrl(state => state.backendUrl);

    const formRef = useRef<HTMLFormElement>(null);
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        
        const formData = new FormData(formRef.current as HTMLFormElement);

        const deadline = new Date(formData.get('deadline') as string).getTime() || '';

        const basicData = {
            task_name: formData.get('task_name') || '',
            employee: formData.get('employee'),
            deadline: deadline,
            task_remark: formData.get('task_remark') || '',
            task_target: formData.get('task_target'),
            selectedTargets: selectedTargets,
        };

        // 非空检查
        if (basicData.employee === '请选择' || basicData.deadline === '') {
            return showPrompt({
                type: 'error',
                content: '请填写完整的任务基本信息', 
            });
        } else if (selectedTargets.length === 0) {
            return showPrompt({
                type: 'error',
                content: '请分配任务内容',
            });
        };
        // 长度检查
        if (basicData.task_name.length > 20) {
            return showPrompt({
                type: 'error',
                content: '任务名称长度不能超过20字',
            });
        } else if (basicData.task_remark.length > 5000) {
            return showPrompt({
                type: 'error',
                content: '任务备注长度不能超过5000字',
            });
        };

        const res = await makeRequest({
            method: 'POST',
            url: `${backendUrl}/api/v1/tasks/`,
            data: basicData
        });

        if (!('error' in res)) {
            showPrompt({
                type: 'success',
                content: "创建成功"
            });
            setTimeout(() => navigateTo('/dashboard/taskcenter'), 2000);
        };
    };

    return (
        <div className='createTask-wrapper'>
            <header className='createTask-header'>
                <Link to={"/dashboard/taskcenter"}>
                    <img src={backIcon}/>
                </Link>
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