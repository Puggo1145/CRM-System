import { useState, useEffect } from "react";
import makeRequest from '../../../../utils/makeRequest'
import { useLocation, useNavigate } from 'react-router-dom'

import useEditData from "../../../../store/editData";

import { usePrompt } from "../../../../components/prompts/PromptContext";

import { teacherDataType, studentDataType } from '../../../../types/createDataModeltype'

import useUrl from '../../../../store/urls'

export default function StudentData() {
    const location = useLocation();
    const navigateTo = useNavigate();

    const backendUrl = useUrl(state => state.backendUrl);
    const passEditData = useEditData(state => state.passEditData);

    const { showCheck, showPrompt } = usePrompt();

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

    const handleEdit = () => {
        passEditData({ target: 'teacher', data: teacher! });
        navigateTo('/dashboard/database/edit');
    };
    const handleEditStudent = (student: studentDataType) => {
        passEditData({ target: 'student', data: student });
        navigateTo('/dashboard/database/edit');
    };

    const handleTeacherDelete = async () => {
        const result = await showCheck("确定删除该班主任吗？");
        if (!result) return;

        const res = await makeRequest({
            method: 'DELETE',
            url: `${backendUrl}/api/v1/data/teachers/${teacher?.teacher_id}`
        });

        if (!('error' in res)) {
            showPrompt({
                content: "删除成功",
                type: "success"
            });

            history.back();
        } else {
            showPrompt({
                content: `${res.error}`,
                type: "error"
            });
        }
    };

    const handleStudentDelete = async (student_id: string) => {
        const result = await showCheck("确定删除该学生吗？");
        if (!result) return;

        const res = await makeRequest({
            method: 'DELETE',
            url: `${backendUrl}/api/v1/data/students/${student_id}`
        });

        if (!('error' in res)) {
            showPrompt({
                content: "删除成功",
                type: "success"
            });

            setStudents(students.filter(student => student.student_id !== student_id));
        } else {
            showPrompt({
                content: `${res.error}`,
                type: "error"
            });
        }
    };

    return (
        <>
            <section className='database-content-data'>
                <section className='database-content-data-father'>
                    <div className='database-content-data-item'>
                        <div className="database-content-data-father-basicInfo">
                            <h3>班主任：{teacher?.teacher_name}</h3>
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
                        <div className="database-content-data-item-fns">
                            <button className='database-content-edit btn-blue' onClick={handleEdit}>编辑</button>
                            <button className='database-content-edit btn-danger' onClick={handleTeacherDelete}>删除</button>
                        </div>
                    </div>
                </section>
                {
                    students.length > 0 ?
                        students.map(student => {
                            return (
                                <div key={student.student_id} className="database-content-data-item">
                                    <div className="database-content-data-father-basicInfo">
                                        <h3>{student.student_name}</h3>
                                        <section className='database-content-data-item-detail'>
                                            <p>性别：{student.student_sex}</p>
                                            <p>年龄：{student.student_age}</p>
                                            <p>手机号：{student.student_phone}</p>
                                            {student.student_mother_phone ? <p>母亲手机号：{student.student_mother_phone}</p> : null}
                                            {student.student_father_phone ? <p>父亲手机号：{student.student_father_phone}</p> : null}
                                            {student.student_relative_phone ? <p>亲属手机号：{student.student_relative_phone}</p> : null}
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
                                    <div className="database-content-data-item-fns">
                                        <button className='database-content-edit btn-blue' onClick={() => handleEditStudent(student)}>编辑</button>
                                        <button className='database-content-edit btn-danger' onClick={() => handleStudentDelete(student.student_id)}>删除</button>
                                    </div>
                                </div>
                            )
                        }) :
                        <div className="database-content-data-item database-content-data-noData">暂无数据</div>
                }
            </section>
        </>
    )
}
