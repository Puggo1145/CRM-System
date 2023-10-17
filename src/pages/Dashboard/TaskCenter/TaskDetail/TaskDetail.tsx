import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import makeRequest from "../../../../utils/makeRequest";

import useUrl from "../../../../store/urls";
import useEmployee from "../../../../store/employee";

import BackgroundMask from "../../../../components/BackgroundMask/BackgroundMask";

import { TaskType } from "../TaskBoard/TaskBoard";

import './TaskDetail.css';

import closeIcon from '../../../../static/common/close-icon.png'

export default function TaskDetail() {

    const location = useLocation();

    const backendUrl = useUrl(state => state.backendUrl);
    const employeeInfo = useEmployee(state => state.employeeInfo);

    const [task, setTask] = useState<Partial<TaskType>>({
        task_id: '',
        task_name: '',
        username: '',
        task_target: '',
        task_remark: '',
        deadline: '',
        status: ''
    });
    const [taskTargetObj, setTaskTargetObj] = useState([]);

    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    useEffect(() => {
        const task_id = location.pathname.split('/')[3];

        (async () => {
            // 请求 task 的基本信息
            const taskRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/tasks/${task_id}?select=1`,
            });

            if (!('error' in taskRes)) {
                setTask(taskRes.data.data);
            };

            // 请求 taskTarget
            const taskTargetRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/tasks/taskTargetObj/${task_id}?task_target=${task.task_target === '班主任' ? '0' : '1'}`,
            });

            if (!('error' in taskTargetRes)) {
                setTaskTargetObj(taskTargetRes.data.data);
                console.log(taskTargetRes.data.data);

            };
        })();
    }, [])

    return createPortal(
        <>
            <div className="taskDetail-wrapper board-component">
                <header>
                    <h3>任务详情</h3>
                    <Link to={"/dashboard/taskcenter"}>
                        <img src={closeIcon} />
                    </Link>
                </header>
                <ul className="taskDetail-content">

                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key" style={{color: isEditMode ? "#4362e2" : ''}}>任务名称：</h6>
                        {
                            isEditMode ?
                                <input className="form-input" type="text" placeholder="请编辑任务名称" defaultValue={task.task_name} />
                                :
                                <span className="taskDetail-content-item-value">{task.task_name ? task.task_name : '无'}</span>
                        }
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key">任务目标：</h6>
                        <span className="taskDetail-content-item-value">{task.task_target}</span>
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key" style={{color: isEditMode ? "#4362e2" : ''}}>对接员工：</h6>
                        {
                            isEditMode ?
                                <select className="form-select" defaultValue={task.username}>
                                    {
                                        employeeInfo.map((employee) => {
                                            return <option value={employee.username} key={employee.user_id}>{employee.username}</option>
                                        })
                                    }
                                </select>
                                :
                                <span className="taskDetail-content-item-value">{task.username}</span>

                        }
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key" style={{color: isEditMode ? "#4362e2" : ''}}>备注：</h6>
                        {
                            isEditMode ?
                                <textarea name="" className="form-textarea" placeholder="请编辑备注" defaultValue={task.task_remark}></textarea>
                                :
                                <span className="taskDetail-content-item-value">{task.task_remark ? task.task_remark : '无'}</span>
                        }
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key">状态：</h6>
                        <span className="taskDetail-content-item-value">{task.status}</span>
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key" style={{color: isEditMode ? "#4362e2" : ''}}>截止时间：</h6>
                        {
                            isEditMode ?
                                <input className="form-input" type="date" />
                                :
                                <span className="taskDetail-content-item-value">{new Date(Number(task.deadline)).toLocaleString()}</span>
                        }
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key">任务对象</h6>
                        <div className="taskDetail-content-item-value  taskDetail-content-taskTargetObjs">

                            {
                                taskTargetObj!.map(item => {
                                    const task_target = task.task_target === '班主任' ? 'teacher' : 'student';

                                    return (
                                        <div key={item[`${task_target}_id`]}>
                                            <span>姓名：{item[`${task_target}_name`]}</span>
                                            <span>状态：{item[`${task_target}_status`]}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </li>
                </ul>
                <section className="taskDetail-fns">
                    {
                        isEditMode ?
                            <>
                                <button className="btn-blue" style={{ backgroundColor: '#999' }} onClick={() => setIsEditMode(!isEditMode)}>取消</button>
                                <button className="btn-blue">提交</button>
                            </>
                            :
                            <>
                                <button className="btn-blue" onClick={() => setIsEditMode(!isEditMode)}>编辑</button>
                                <button className="btn-blue" style={{ backgroundColor: '#DE1F1F' }}>删除</button>
                            </>

                    }
                </section>
            </div>
            <BackgroundMask />
        </>,
        document.body
    )
};