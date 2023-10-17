import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import makeRequest from "../../../../utils/makeRequest";

import useUrl from "../../../../store/urls";

import BackgroundMask from "../../../../components/BackgroundMask/BackgroundMask";

import { TaskType } from "../TaskBoard/TaskBoard";

import './TaskDetail.css';

import closeIcon from '../../../../static/common/close-icon.png'

interface formDetail {
    formType: string
    value?: string | string[]
};

export default function TaskDetail() {

    const location = useLocation();

    const backendUrl = useUrl(state => state.backendUrl);

    const [task, setTask] = useState<TaskType>();
    const [enKeyToCn] = useState<Partial<Record<keyof TaskType, string>>>({
        task_name: "任务名",
        task_target: "任务目标",
        username: "对接员工",
        task_remark: "备注",

        status: "状态",

        deadline: "截止时间",
    });

    const [mode, setMode] = useState<'edit' | 'view'>('view');
    const [keyOfForm] = useState<Partial<Record<keyof TaskType, formDetail>>>({
        task_name: {formType: "input"},
        username: {formType: "select"},
        task_remark: {formType: "input"},

        status: {formType: "select", value: ["待确认", "进行中", "待审核", "已完成", "已逾期"]},

        deadline: {formType: "time"},
    });
    const renderForm = (formtype: string, value?: string[]) => {
        switch (formtype) {
            case 'input':
                return (
                    <input type="text" />
                );
            case 'select':
                return (
                    <select>
                        {
                            value?.map(item => {
                                return (
                                    <option value={item}>{item}</option>
                                )
                            })
                        }
                    </select>
                );
            case 'time':
                return (
                    <input type="date" />
                );
            default:
                return null;
        }
    };


    useEffect(() => {
        const task_id = location.pathname.split('/')[3];

        (async () => {

            const taskRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/tasks/${task_id}?select=1`,
            });

            if (!('error' in taskRes)) {
                console.log(taskRes.data.data);
                setTask(taskRes.data.data);
            }
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
                    {
                        task &&
                        Object.entries(task).map(([key, value]) => {
                            if (key === 'task_id') return null;

                            return (
                                <li className="taskDetail-content-item">
                                    <h6 className="taskDetail-content-item-key">{enKeyToCn[key]}:</h6>
                                    <span className="taskDetail-content-item-value">
                                        {
                                            key === 'deadline' ?
                                            new Date(Number(value)).toLocaleString().split('/').join('-') :
                                            value ? value : '无'
                                        }
                                    </span>
                                    {
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
                <section className="taskDetail-fns">
                    <button className="btn-blue" onClick={() => setMode("edit")}>编辑</button>
                    <button className="btn-blue" style={{backgroundColor: '#DE1F1F'}}>删除</button>
                </section>
            </div>
            <BackgroundMask />
        </>,
        document.body
    )
};