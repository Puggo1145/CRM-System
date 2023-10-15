import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

// store
import useUrl from '../../../../store/urls';

//utile
import makeRequest from '../../../../utils/makeRequest';

// types
import { schoolDataType } from '../../../../types/createDataModeltype';
import { teacherDataType } from '../../../../types/createDataModeltype';

import './TeacherData.css'

export default function TeacherData() {

    const location = useLocation();

    const backendUrl = useUrl(state => state.backendUrl);

    const [school, setSchool] = useState<schoolDataType>();
    const [teachers, setTeachers] = useState<teacherDataType[]>([]);

    useEffect(() => {
        (async () => {
            if (!location.search) return;

            const teachersRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/data/teachers?id=${location.search.slice(1)}`
            });

            if (!('error' in teachersRes)) {
                setTeachers(teachersRes.data.data.teachers);
            };

            const schoolRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/data/schools?father_id=${location.search.slice(1)}`
            });

            if (!('error' in schoolRes)) {
                setSchool(schoolRes.data.data.schools[0]);
            };
        })();
    }, [location.search]);

    return (
        <>
            <section className='database-content-data database-content-data-father'>
                <div className='database-content-data-item'>
                    <h3>{school?.school_name}</h3>
                    <p>地址：{school?.school_address}</p>
                    <p>创建时间：{new Date(Number(school?.create_time)).toLocaleString()}</p>
                    <p>备注：{school?.school_remark ? school.school_remark : "暂无数据"}</p>
                </div>
            </section>
            <section className='database-content-data'>
                {
                    teachers.length > 0 ?
                    teachers.map(teacher => {
                        return (
                            <Link key={teacher.teacher_id} className="database-content-data-item" to={`${location.pathname}/${teacher.teacher_name}?${teacher.teacher_id}`}>
                                <h3>{teacher.teacher_name}</h3>
                                <section className='database-content-data-item-detail'>
                                    <span>班主任电话：{teacher.teacher_phone}</span>
                                    <span>状态：{teacher.teacher_status}</span>
                                </section>
                            </Link>
                        )
                    }) : 
                    <div className="database-content-data-item database-content-data-noData">暂无数据</div>
                }
            </section>
        </>
    )
}