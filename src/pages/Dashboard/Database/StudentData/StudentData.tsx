import { useState, useEffect } from "react";
import makeRequest from '../../../../utils/makeRequest'
import { Link, useLocation } from 'react-router-dom'

import { teacherDataType, studentDataType } from '../../../../types/createDataModeltype'

import useUrl from '../../../../store/urls'

export default function StudentData() {
    const location = useLocation();

    const backendUrl = useUrl(state => state.backendUrl);

    const [teacher, setTeacher] = useState<teacherDataType>();
    const [students, setStudents] = useState<studentDataType[]>([]);

    useEffect(() => {
        (async () => {
            if (!location.search) return;

            const studentsRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/data/students?father_id=${location.search.slice(1)}`
            });

            if (!('error' in studentsRes)) {
                console.log(studentsRes.data.data.students);

                setStudents(studentsRes.data.data.students);
            };

            const teacherRes = await makeRequest({
                method: 'GET',
                url: `${backendUrl}/api/v1/data/teachers?id=${location.search.slice(1)}`
            });

            if (!('error' in teacherRes)) {
                setTeacher(teacherRes.data.data.teachers[0]);
            };


        })();
    }, [location.search]);

    return (
        <>
            <section className='database-content-data'>
                <section className='database-content-data-father'>
                    <div className='database-content-data-item'>
                        <div className="database-content-data-father-basicInfo">
                            <h3>{teacher?.teacher_name}</h3>
                            <section className='database-content-data-item-detail'>
                                <p>性别：{teacher?.teacher_sex}</p>
                                <p>年龄：{teacher?.teacher_age}</p>
                                <p>毕业班年级：{teacher?.teacher_class}</p>
                                <p>手机号：{teacher?.teacher_phone}</p>
                                <p>微信：{teacher?.teacher_wechat}</p>
                                <p>类型：{teacher?.teacher_type}</p>
                                <p>状态：{teacher?.teacher_status}</p>
                                <p>创建时间：{new Date(Number(teacher?.create_time)).toLocaleString()}</p>
                            </section>
                            <section className="database-content-data-item-remark">
                                备注：{teacher?.teacher_remark ? teacher?.teacher_remark : "无"}
                            </section>
                        </div>
                        <button className='database-content-edit btn-blue'>编辑</button>
                    </div>
                </section>
                {
                    students.length > 0 ?
                        students.map(student => {
                            return (
                                <div key={student.student_id} className="database-content-data-item">
                                    <h3>{student.student_name}</h3>
                                    <section className='database-content-data-item-detail'>
                                        <p>性别：{student.student_sex}</p>
                                        <p>年龄：{student.student_age}</p>
                                        <p>手机号：{student.student_phone}</p>
                                        {student.student_mother_phone ? <p>`母亲手机号：student.student_mother_phone</p> : null}
                                        {student.student_father_phone ? <p>父亲手机号：student.student_father_phone</p> : null}
                                        {student.student_relative_phone ? <p>亲属手机号：student.student_relative_phone</p> : null}
                                        <p>微信号：{student.student_wechat}</p>
                                        <p>类型：{student.student_type}</p>
                                        <p>目标院校：{student.student_target_school_type}</p>
                                        <p>状态：{student.student_status}</p>
                                        <p>创建时间：{new Date(Number(student.create_time)).toLocaleString()}</p>
                                    </section>
                                    <section className="database-content-data-item-remark">
                                        备注：{student.student_remark ? student.student_remark : "无"}
                                    </section>
                                </div>
                            )
                        }) :
                        <div className="database-content-data-item database-content-data-noData">暂无数据</div>
                }
            </section>
        </>
    )
}
