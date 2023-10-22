import { useState, useEffect, useRef, FormEvent } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import makeRequest from "../../../../utils/makeRequest";

import useUrl from "../../../../store/urls";
import useEmployee from "../../../../store/employee";
import { usePrompt } from "../../../../components/prompts/PromptContext";

import { studentStatusColor, taskStatusColor, teacherStatusColor } from "../../../../utils/handleStatusColor";

import BackgroundMask from "../../../../components/BackgroundMask/BackgroundMask";

import { TaskType } from "../TaskBoard/TaskBoard";

import './TaskDetail.css';

import closeIcon from '../../../../static/common/close-icon.png'

interface taskTargetObjType {
    [key: string]: string | number | undefined;
    taskTargetObj_id: string,
    teacher_id?: string,
    student_id?: string,

    task_id: string,
}

export default function TaskDetail() {

    const location = useLocation();
    const navigateTo = useNavigate();
    const { showCheck, showPrompt } = usePrompt();

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
    const [taskTargetObj, setTaskTargetObj] = useState<taskTargetObjType[]>([]);

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
        })();
    }, [])
    // 请求 taskTargetObj
    useEffect(() => {
        if (task.task_id === '') return;

        (async () => {
            const taskTargetRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/tasks/taskTargetObj/${task.task_id}?task_target=${task.task_target === '班主任' ? '0' : '1'}`,
            });

            if (!('error' in taskTargetRes)) {
                setTaskTargetObj(taskTargetRes.data.data);
            };
        })();
    }, [task])

    const handleTaskDelete = async () => {
        const result = await showCheck("确定要删除吗？此操作不可撤销，且被删除的对象状态都会被重置为'未对接'");
        if (!result) return;

        const res = await makeRequest({
            method: 'DELETE',
            url: `${backendUrl}/api/v1/tasks/${task.task_id}`,
            data: {
                task_target: task.task_target,
                taskTargetObjs: taskTargetObj.map(item => item.taskTargetObj_id),
                targets_id: taskTargetObj.map(item => item[`${task.task_target === '班主任' ? 'teacher' : 'student'}_id`])
            }
        });

        if (!('error' in res)) {
            showPrompt({
                content: '删除成功',
                type: 'success'
            });

            window.location.reload();
            navigateTo('/dashboard/taskcenter');
        } else {
            showPrompt({
                content: `错误：${res.error}`,
                type: 'error'
            });
        };
    };

    const task_name_ref = useRef<HTMLInputElement>(null);
    const employee_ref = useRef<HTMLSelectElement>(null);
    const task_remark_ref = useRef<HTMLTextAreaElement>(null);
    const deadline_ref = useRef<HTMLInputElement>(null);

    const handleDataEditSubmit = (event: FormEvent) => {
        event.preventDefault();

        const fieldsOnUpdate = {
            task_name: task_name_ref.current?.value || '',
            employee: employee_ref.current?.value,
            task_remark: task_remark_ref.current?.value || '',
            deadline: new Date(deadline_ref.current?.value!).getTime() || task.deadline,
        };

        const res = makeRequest({
            method: 'PATCH',
            url: `${backendUrl}/api/v1/tasks/${task.task_id}`,
            data: {
                fieldsOnUpdate: fieldsOnUpdate
            }
        });

        if (!('error' in res)) {
            showPrompt({
                content: '更新成功',
                type: 'success'
            });
            window.location.reload();
        } else {
            showPrompt({
                content: `错误：${res.error}`,
                type: 'error'
            });
        };
    };

    const handleVerification = async (action: 'pass' | 'redo') => {
        const result = await showCheck(`确定要${action === 'pass' ? '通过审核' : '打回'}吗？`);
        if (!result) return;

        const targetStatus = action === 'pass' ? '已完成' : '进行中';

        const res = await makeRequest({
            method: 'PATCH',
            url: `${backendUrl}/api/v1/tasks/${task.task_id}`,
            data: {
                fieldsOnUpdate: { status: targetStatus }
            }
        });

        if (!('error' in res)) {
            showPrompt({
                content: `${action === 'pass' ? '审核' : '打回'}成功`,
                type: 'success'
            });
            window.location.reload();
        } else {
            showPrompt({
                content: `错误：${res.error}`,
                type: 'error'
            });
        };
    };

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
                        <h6 className="taskDetail-content-item-key" style={{ color: isEditMode ? "#4362e2" : '' }}>任务名称：</h6>
                        {
                            isEditMode ?
                                <input className="form-input" type="text" ref={task_name_ref} placeholder="请编辑任务名称" defaultValue={task.task_name} />
                                :
                                <span className="taskDetail-content-item-value">{task.task_name ? task.task_name : '无'}</span>
                        }
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key">任务目标：</h6>
                        <span className="taskDetail-content-item-value">{task.task_target}</span>
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key" style={{ color: isEditMode ? "#4362e2" : '' }}>对接员工：</h6>
                        {
                            isEditMode ?
                                <select className="form-select" ref={employee_ref} defaultValue={task.username}>
                                    {
                                        employeeInfo.map((employee) => {
                                            return <option value={employee.user_id} key={employee.user_id}>{employee.username}</option>
                                        })
                                    }
                                </select>
                                :
                                <span className="taskDetail-content-item-value">{task.username}</span>

                        }
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key" style={{ color: isEditMode ? "#4362e2" : '' }}>备注：</h6>
                        {
                            isEditMode ?
                                <textarea className="form-textarea" ref={task_remark_ref} placeholder="请编辑备注" defaultValue={task.task_remark}></textarea>
                                :
                                <span className="taskDetail-content-item-value">{task.task_remark ? task.task_remark : '无'}</span>
                        }
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key">状态：</h6>
                        <span className="taskDetail-content-item-value" style={{ color: taskStatusColor(task.status as string) }}>{task.status}</span>
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key" style={{ color: isEditMode ? "#4362e2" : '' }}>截止时间：</h6>
                        {
                            isEditMode ?
                                <input className="form-input" ref={deadline_ref} type="datetime-local" defaultValue={task.deadline} />
                                :
                                <span className="taskDetail-content-item-value">{new Date(Number(task.deadline)).toLocaleString()}</span>
                        }
                    </li>
                    <li className="taskDetail-content-item">
                        <h6 className="taskDetail-content-item-key">任务对象</h6>
                        <div className="taskDetail-content-item-value  taskDetail-content-taskTargetObjs">
                            <div className="taskDetail-content-item-headerRow">
                                <span>姓名</span>
                                <span>状态</span>
                            </div>
                            <ul className="taskDetail-content-items">
                                {
                                    taskTargetObj!.map(item => {
                                        const task_target = task.task_target === '班主任' ? 'teacher' : 'student';

                                        return (
                                            <li key={item[`${task_target}_id`]} className="taskDetail-content-item-item">
                                                <span>{item[`${task_target}_name`]}</span>
                                                <span
                                                    style={{
                                                        color: task_target === 'teacher' ?
                                                            teacherStatusColor(item[`${task_target}_status`] as string)
                                                            :
                                                            studentStatusColor(item[`${task_target}_status`] as string)
                                                    }}>
                                                    {item[`${task_target}_status`]}
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>

                        </div>

                    </li>
                </ul>
                <section className="taskDetail-fns">
                    {
                        isEditMode ?
                            <>
                                <button className="btn-blue" style={{ backgroundColor: '#999' }} onClick={() => setIsEditMode(!isEditMode)}>取消</button>
                                <button className="btn-blue" onClick={handleDataEditSubmit}>提交</button>
                            </>
                            :
                            <>
                                <button className="btn-blue" onClick={() => setIsEditMode(!isEditMode)}>编辑</button>
                                <button className="btn-blue" style={{ backgroundColor: '#DE1F1F' }} onClick={handleTaskDelete}>删除</button>
                                {
                                    task.status === '待审核' &&
                                    <>
                                        <button className="btn-blue" style={{ backgroundColor: '#2c9e4b' }} onClick={() => handleVerification('pass')}>通过审核</button>
                                        <button className="btn-blue" style={{ backgroundColor: '#fbc119' }} onClick={() => handleVerification('redo')}>打回</button>
                                    </>
                                }
                            </>

                    }
                </section>
            </div>
            <BackgroundMask />
        </>,
        document.body
    )
};