import { useState, useEffect } from 'react'
import makeRequest from '../../../../../utils/makeRequest';

// stores
import useUrl from '../../../../../store/urls';

import './TaskContent.css'

interface targetType {
    id: string,
    name: string,
    type: string,
    status: string,
}

export default function TaskContent(
    { selectedTargets, setSelectedTargets }: {
        selectedTargets: string[],
        setSelectedTargets: React.Dispatch<React.SetStateAction<string[]>>
    }

) {

    const backendUrl = useUrl(state => state.backendUrl);

    // 筛选条件 /////////////////////////////////////////////////////////////
    // 任务目标筛选条件
    const [taskTarget, setTaskTarget] = useState<string[]>([
        '请选择', '班主任', '学生'
    ]);
    const [currentTaskTarget, setCurrentTaskTarget] = useState<string>('请选择');
    // 学校筛选条件 [id, name]
    const [schools, setSchools] = useState<string[][]>([
        ['', '全部'],
    ]);
    const [currentSchoolId, setCurrentSchoolId] = useState<string>('');
    // 老师筛选条件
    const [teachers, setTeachers] = useState<string[][]>([
        ['', '全部'],
    ]);
    const [currentTeacherId, setCurrentTeacherId] = useState<string>('');
    // 状态筛选条件
    const [status, setStatus] = useState<string[]>([
        "全部", "未对接", "对接中", "对接成功", "对接失败"
    ]);
    const [currentStatus, setCurrentStatus] = useState<string>('');


    // 查询结果 /////////////////////////////////////////////////////////////
    const [targets, setTargets] = useState<targetType[]>([]);

    const handleSelectTarget = (id: string) => {
        if (selectedTargets.includes(id)) {
            setSelectedTargets(selectedTargets.filter(item => item !== id));
        } else {
            setSelectedTargets([...selectedTargets, id]);
        }
    };

    // 请求所有学校
    useEffect(() => {
        (async () => {
            const schoolRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/data/allSchools`,
            });

            if (!('error' in schoolRes)) {
                const newSchools = [...schoolRes.data.data.schools].map(item => [item.school_id, item.school_name]);
                newSchools.unshift(['', '全部']);
                setSchools(newSchools);
            };
        })();
    }, []);
    // 根据学校请求所有老师
    useEffect(() => {
        if (!currentSchoolId) return;

        (async () => {
            const res = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/data/allTeachers?school_id=${currentSchoolId}`,
            });

            if (!('error' in res)) {
                const newTeachers = [...res.data.data].map(item => [item.id, item.name]);
                newTeachers.unshift(['', '全部']);
                setTeachers(newTeachers);
            };
        })();
    }, [currentSchoolId]);

    // 根据任务目标请求对应的任务对象
    useEffect(() => {
        if (currentTaskTarget === '请选择') return;
        setSelectedTargets([]);

        (async () => {
            const query_taskTarget = currentTaskTarget === '班主任' ? 'allTeachers' : 'allStudents'
            const query_school_id = currentSchoolId ? `school_id=${currentSchoolId}` : '';
            const query_teacher_id = currentTeacherId ? `teacher_id=${currentTeacherId}` : '';
            const query_status = currentStatus === '全部' ? '' : `status=${currentStatus}`;

            const res = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/data/${query_taskTarget}?${query_school_id}&${query_teacher_id}&${query_status}`,
            });

            if (!('error' in res)) {
                setTargets(res.data.data);
            };
        })();
    }, [currentTaskTarget, currentSchoolId, currentTeacherId, currentStatus])

    return (
        <div className="taskContent-wrapper board-component">
            <header>
                <h3>分配任务内容</h3>
                <p>选择要分配的任务对象，班主任和学生不能混合选择，否则会丢失之前选择的内容</p>
            </header>
            <section className='taskContent-content'>
                <section className='taskContent-content-item'>
                    <label>任务目标</label>
                    <select className="form-select" name="task_target" onChange={(event) => setCurrentTaskTarget(event.target.value)}>
                        {
                            taskTarget.map((item, index) => {
                                return (
                                    <option value={item} key={index}>{item}</option>
                                )
                            })
                        }
                    </select>
                </section>
                {
                    // filters
                    currentTaskTarget !== '请选择' &&
                    <section className='taskContent-content-filters'>
                        <section className='taskContent-content-item'>
                            <label>按学校筛选</label>
                            <select className="form-select" name="schools" onChange={(event) => setCurrentSchoolId(event.target.value)}>
                                {
                                    schools.map(item => {
                                        return (
                                            <option value={item[0]} key={item[0]}>{item[1]}</option>
                                        )
                                    })
                                }
                            </select>
                        </section>
                        {
                            currentTaskTarget === '学生' &&
                            <section className='taskContent-content-item'>
                                <label>按班主任筛选</label>
                                <select className="form-select" name="teachers" onChange={(event) => setCurrentTeacherId(event.target.value)}>
                                    {
                                        teachers.map(item => {
                                            return (
                                                <option value={item[0]} key={item[0]}>{item[1]}</option>
                                            )
                                        })
                                    }
                                </select>
                            </section>
                        }
                        <section className='taskContent-content-item'>
                            <label>状态</label>
                            <select className="form-select" name="status" onChange={(event) => setCurrentStatus(event.target.value)}>
                                {
                                    status.map((item, index) => {
                                        return (
                                            <option value={item} key={`${item}-${index}`}>{item}</option>
                                        )
                                    })
                                }
                            </select>
                        </section>
                    </section>
                }
                {
                    // 匹配 target 结果
                    currentTaskTarget !== '请选择' &&
                    <div className='taskContent-selectTasks'>
                        <div className='taskContent-selectTasks-item taskContent-selectTasks-headerRow'>
                            <span className='taskContent-selectTasks-item-name'>姓名</span>
                            <span>类型</span>
                            <span>状态</span>
                        </div>
                        {
                            targets.map(item => {
                                return (
                                    <div
                                        className={`taskContent-selectTasks-item ${selectedTargets.includes(item.id) && 'taskContent-selectTasks-item-selected'}`}
                                        key={item.id}
                                        onClick={() => handleSelectTarget(item.id)}>
                                        <span className='taskContent-selectTasks-item-name'>{item.name}</span>
                                        <span>{item.type}</span>
                                        <span>{item.status}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </section>
        </div>
    )
}
