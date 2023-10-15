import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PubSub from 'pubsub-js';
import makeRequest from '../../../../utils/makeRequest';

import BackgroundMask from '../../../../components/BackgroundMask/BackgroundMask';

// stores
import useSelects from '../../../../store/selects';

import CheckPrompt from '../../../../components/CheckPrompt/CheckPrompt';
import { handleComponentOpen } from '../../../../utils/handleComponentOpen';
import { usePrompt } from '../../../../components/Prompt/PromptContext';
import deepClone from '../../../../utils/deepClone';

// types
import { schoolModelType } from '../../../../types/createDataModeltype';
import { teacherModelType } from '../../../../types/createDataModeltype';
import { studentModelType } from '../../../../types/createDataModeltype';
import { formType } from '../../../../types/createDataModeltype';

import './CreateData.css'

import closeIcon from '../../../../static/common/close-icon.png'
import openIcon from '../../../../static/common/open.png';
import useUrl from '../../../../store/urls';

type FormType = {
    school: schoolModelType,
    teachers: {
        teacher: teacherModelType | null,
        students: (studentModelType | null)[],
    }[],
}

interface renderFormType {
    formName: 'input' | 'textarea' | 'select',
    field: string,
    label: string,
    selects?: string[],
    formIdx: number,
    teacherIdx?: number,
    studentIdx?: number,
}

export default function CreateData() {

    const { showPrompt } = usePrompt();
    const backendUrl = useUrl(state => state.backendUrl);

    const [doubleCheck, setDoubleCheck] = useState<boolean>(false);

    const selects = useSelects(state => state);

    const [schoolModel] = useState<schoolModelType>({
        school_name: { value: '', label: '学校名称', form: 'input' },
        school_address: { value: '', label: '学校地址', form: 'input' },
        school_remark: { value: '', label: '备注', form: 'textarea' },
    });
    const [teacherModel] = useState<teacherModelType>({
        teacher_name: { value: '', label: '教师姓名', form: 'input' },
        teacher_sex: { value: '请选择', label: '性别', form: 'select', selects: ['请选择', '男', '女'] },
        teacher_age: { value: '', label: '年龄', form: 'input' },
        teacher_class: { value: '', label: '毕业班年级', form: 'input' },

        teacher_phone: { value: '', label: '手机号', form: 'input' },
        teacher_wechat: { value: '', label: '微信号', form: 'input' },

        teacher_type: { value: '请选择', label: '类型', form: 'select', selects: selects.teacherTypes },
        teacher_status: { value: '请选择', label: '对接状态', form: 'select', selects: selects.teacherStatus },
        teacher_remark: { value: '', label: '备注', form: 'textarea' },
    });
    const [studentModel] = useState<studentModelType>({
        student_name: { value: '', label: '学生姓名', form: 'input' },
        student_sex: { value: '请选择', label: '性别', form: 'select', selects: ['请选择', '男', '女'] },
        student_age: { value: '', label: '年龄', form: 'input' },

        student_phone: { value: '', label: '手机号', form: 'input' },
        student_mother_phone: { value: '', label: '母亲手机号', form: 'input' },
        student_father_phone: { value: '', label: '父亲手机号', form: 'input' },
        student_relative_phone: { value: '', label: '亲属手机号', form: 'input' },
        student_wechat: { value: '', label: '微信号', form: 'input' },

        student_type: { value: '请选择', label: '类型', form: 'select', selects: selects.studentTypes },
        student_target_school_type: { value: '请选择', label: '目标学校类型', form: 'select', selects: selects.studentTargetSchoolType },
        student_status: { value: '请选择', label: '对接状态', form: 'select', selects: selects.studentStatus },
        student_remark: { value: '', label: '备注', form: 'textarea' },
    });

    const [forms, setForms] = useState<FormType[]>([
        {
            school: schoolModel,
            teachers: [{
                teacher: null,
                students: [null]
            }]
        }
    ])

    const [isTeacherOpened, setIsTeacherOpened] = useState<boolean[]>([]);
    const [isStudentOpened, setIsStudentOpened] = useState<(boolean | [])[][]>([[]]);

    const addTeacher = (formIdx: number, teacherIdx: number) => {
        const newForms = [...forms];
        const newTeacher = deepClone(teacherModel);
        newForms[formIdx].teachers.splice(-1, 0, {
            teacher: newTeacher,
            students: [null]
        });
        setForms(newForms);

        const newTeacherOpened = [...isTeacherOpened];
        newTeacherOpened.push(true);
        setIsTeacherOpened(newTeacherOpened);

        const newStudentOpened = [...isStudentOpened];
        newStudentOpened[teacherIdx] = [];
        setIsStudentOpened(newStudentOpened);
    };

    const deleteTeacher = (formIdx: number, teacherIdx: number) => {
        const newForms = deepClone(forms);
        newForms[formIdx].teachers.splice(teacherIdx, 1);
        setForms(newForms);

        const newTeacherOpened = [...isTeacherOpened];
        newTeacherOpened.splice(teacherIdx, 1);
        setIsTeacherOpened(newTeacherOpened);

        const newStudentOpened = [...isStudentOpened];
        newStudentOpened.splice(teacherIdx, 1);
        setIsStudentOpened(newStudentOpened);
    }

    const addStudent = (formIdx: number, teacherIdx: number) => {
        const newForms = [...forms];
        const newStudent = deepClone(studentModel);
        newForms[formIdx].teachers[teacherIdx].students.splice(-1, 0, newStudent);
        setForms(newForms);

        const newStudentOpened = [...isStudentOpened];
        newStudentOpened[teacherIdx].push(true);
        setIsStudentOpened(newStudentOpened);
    };

    const deleteStudent = (formIdx: number, teacherIdx: number, studentIdx: number) => {
        const newForms = deepClone(forms);
        newForms[formIdx].teachers[teacherIdx].students.splice(studentIdx, 1);
        setForms(newForms);

        const newStudentOpened = [...isStudentOpened];
        newStudentOpened[teacherIdx].splice(studentIdx, 1);
        setIsStudentOpened(newStudentOpened);
    }

    const handleChange = (
        formType: 'school' | 'teacher' | 'student',
        field: string,
        formIdx: number,
        teacherIdx?: number,
        studentIdx?: number,
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newForms = [...forms];
        let targetModel: any;

        if (formType === 'school') {
            targetModel = newForms[formIdx].school;
        } else if (formType === 'teacher' && typeof teacherIdx === 'number') {
            targetModel = newForms[formIdx].teachers[teacherIdx].teacher;
        } else if (formType === 'student' && typeof teacherIdx === 'number' && typeof studentIdx === 'number') {
            targetModel = newForms[formIdx].teachers[teacherIdx].students[studentIdx];
        }

        if (targetModel && field) {
            targetModel[field].value = e.target.value;
        }
        setForms(newForms);
    };

    const renderForm = (data: renderFormType) => {
        const { formName, field, label, selects, formIdx, teacherIdx, studentIdx } = data;

        const optionalFields = ['母亲手机号', '父亲手机号', '亲属手机号'];
        const commonProps = {
            placeholder: formName === 'textarea' || optionalFields.includes(label) ? `(可选)` : `(必填)`,
            onChange: handleChange(field.split('_')[0] as 'school' | 'teacher' | 'student', field, formIdx, teacherIdx, studentIdx)
        };

        switch (formName) {
            case 'input':
                return <input className='form-input' type='text' {...commonProps} />;
            case 'textarea':
                return <textarea className='form-textarea' {...commonProps} />;
            case 'select':
                return (
                    <select className='form-select' {...commonProps}>
                        {selects?.map((select, selectIdx) => (
                            <option className='form-option' key={`select-${selectIdx}`}>{select}</option>
                        ))}
                    </select>
                );
            default:
                return <input type='text' {...commonProps} />;
        }
    };


    // 注意这里的 formType 和组件内的 FormType 不一样
    const nullCheck = (formInfo: formType) => {
        const optionalFields = ['母亲手机号', '父亲手机号', '亲属手机号'];
        const numberTypeFields = ['年龄', '毕业班年级'];

        if (formInfo.form === 'input' && formInfo.value.length === 0 && !optionalFields.includes(formInfo.label)) {
            showPrompt({ content: `必须填写：${formInfo.label}`, type: 'error' });
            return false;

        } else if (formInfo.form === 'select' && formInfo.value === '请选择') {
            showPrompt({ content: `必须选择：${formInfo.label}`, type: 'error' });
            return false;

        } else if (formInfo.form === 'input' && numberTypeFields.includes(formInfo.label) && isNaN(Number(formInfo.value))) {
            showPrompt({ content: `${formInfo.label} 必须为数字`, type: 'error' });
            return false;

        } else {
            return true;
        }
    };
    const handleSubmit = async () => {
        let allFieldsNotNull = true;

        const newFormData = forms.map(form => {
            const school = Object.entries(form.school).reduce((acc: { [key: string]: string }, [key, formInfo]) => {
                const checkResult = nullCheck(formInfo);
                if (!checkResult) {
                    allFieldsNotNull = false;
                }
                acc[key] = formInfo.value;
                return acc;
            }, {});

            const teachers = form.teachers.map(teacher => {
                const teacherObj = teacher.teacher && Object.entries(teacher.teacher).reduce((acc: { [key: string]: string }, [key, formInfo]) => {
                    const checkResult = nullCheck(formInfo);
                    if (!checkResult) {
                        allFieldsNotNull = false;
                    }
                    acc[key] = formInfo.value;
                    return acc;
                }, {});

                const students = teacher.students.map(student => {
                    if (student) {
                        return Object.entries(student).reduce((acc: { [key: string]: string }, [key, formInfo]) => {
                            const checkResult = nullCheck(formInfo);
                            if (!checkResult) {
                                allFieldsNotNull = false;
                            }
                            acc[key] = formInfo.value;
                            return acc;
                        }, {});
                    }
                    return null;
                }).filter(student => student);

                return {
                    teacher: teacherObj,
                    students: students
                };
            }).filter(teacher => teacher.teacher);

            return {
                school: school,
                teachers: teachers
            };
        });

        // 发送请求
        if (!allFieldsNotNull) return
        console.log(newFormData);

        const res = await makeRequest({
            method: 'POST',
            url: `${backendUrl}/api/v1/data`,
            data: newFormData,
        });

        if (res.status === 201) {
            showPrompt({ content: '创建成功', type: 'success' });
            handleComponentOpen('openCreateData')
            PubSub.publish('refresh');
        } else if ('error' in res && res.status.toString().startsWith('4')) {
            showPrompt({ content: res.error, type: 'error' });
        };
    };

    const handleCloseClick = () => {
        Object.values(forms[0].school).filter(item => item.value).length > 0 ?
            setDoubleCheck(true) :
            handleComponentOpen('openCreateData')
    };
    const createDataClose = (option: boolean) => {
        option && handleComponentOpen('openCreateData')
        setDoubleCheck(false);
    };

    return createPortal(
        <div className='createData-wrapper'>
            <BackgroundMask />
            <header>
                <h3>快速添加</h3>
                <img src={closeIcon} onClick={handleCloseClick}
                />
            </header>
            <ul className='createData-forms'>
                {
                    forms.map((form, formIdx) => (
                        <li key={`form-${formIdx}`} className='createData-form'>
                            {/* 学校表单 */}
                            <section className='createData-formData createData-school'>
                                <h4>学校</h4>
                                {
                                    Object.entries(form.school).map(([key, value]) => (
                                        <section key={`form-${formIdx}-school-${key}`} className='createData-formData-item'>
                                            <label>{value.label}</label>
                                            {
                                                renderForm({
                                                    formName: value.form,
                                                    field: key,
                                                    label: value.label,
                                                    selects: value.selects,
                                                    formIdx,
                                                })

                                            }
                                        </section>
                                    ))
                                }
                                {/* 老师表单 */}
                                {
                                    form.teachers.map((teacherData, teacherIdx) => {
                                        if (teacherData.teacher) {
                                            return (
                                                <div key={`form-${formIdx}-teacher-${teacherIdx}`} className='createData-formData createData-teacher' style={{ maxHeight: isTeacherOpened[teacherIdx] ? '' : '44px' }}>
                                                    <div className='createData-formData-header'>
                                                        <span className='createData-formData-header-left'>
                                                            <img src={openIcon}
                                                                onClick={() => {
                                                                    const newTeacherOpened = [...isTeacherOpened];
                                                                    newTeacherOpened[teacherIdx] = !newTeacherOpened[teacherIdx];
                                                                    setIsTeacherOpened(newTeacherOpened);
                                                                }}
                                                                style={{ transform: `rotate(${isTeacherOpened[teacherIdx] ? 180 : 0}deg)` }}
                                                            />
                                                            <h4>{`班主任: ${teacherData.teacher.teacher_name.value}`}</h4>
                                                        </span>
                                                        <span className='createData-formData-header-right'>
                                                            <img src={closeIcon} onClick={() => deleteTeacher(formIdx, teacherIdx)} />
                                                        </span>
                                                    </div>
                                                    {
                                                        Object.entries(teacherModel).map(([key, value]) => (
                                                            <section key={`form-${formIdx}-teacher-${teacherIdx}-${key}`} className='createData-formData-item'>
                                                                <label>{value.label}</label>
                                                                {
                                                                    renderForm({
                                                                        formName: value.form,
                                                                        field: key,
                                                                        label: value.label,
                                                                        selects: value.selects,
                                                                        formIdx,
                                                                        teacherIdx,
                                                                    })

                                                                }
                                                            </section>
                                                        ))
                                                    }
                                                    {/* 学生表单 */}
                                                    {
                                                        teacherData.students.map((student, studentIdx) => {
                                                            if (student) {
                                                                return (
                                                                    <div key={`form-${formIdx}-student-${studentIdx}`} className='createData-formData createData-student' style={{ maxHeight: isStudentOpened[teacherIdx][studentIdx] ? '' : '44px' }}>
                                                                        <div className='createData-formData-header'>
                                                                            <span className='createData-formData-header-left'>
                                                                                <img src={openIcon}
                                                                                    onClick={() => {
                                                                                        const newStudentOpened = [...isStudentOpened];
                                                                                        newStudentOpened[teacherIdx][studentIdx] = !newStudentOpened[teacherIdx][studentIdx];
                                                                                        setIsStudentOpened(newStudentOpened);
                                                                                    }}
                                                                                    style={{ transform: `rotate(${isStudentOpened[teacherIdx][studentIdx] ? 180 : 0}deg)` }}
                                                                                />
                                                                                <h4>{`学生：${student.student_name.value} —— 班主任: ${teacherData.teacher?.teacher_name.value}`}</h4>
                                                                            </span>
                                                                            <span className='createData-formData-header-right'>
                                                                                <img src={closeIcon} onClick={() => deleteStudent(formIdx, teacherIdx, studentIdx)} />
                                                                            </span>
                                                                        </div>
                                                                        {
                                                                            Object.entries(studentModel).map(([key, value]) => (
                                                                                <div key={`form-${formIdx}-student-${studentIdx}-${key}`} className='createData-formData-item'>
                                                                                    <label>{value.label}</label>
                                                                                    {
                                                                                        renderForm({
                                                                                            formName: value.form,
                                                                                            field: key,
                                                                                            label: value.label,
                                                                                            selects: value.selects,
                                                                                            formIdx,
                                                                                            teacherIdx,
                                                                                            studentIdx
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                )
                                                            } else {
                                                                return (
                                                                    <button key={`form-${formIdx}-student-${studentIdx}`}
                                                                        className="createData-add"
                                                                        onClick={() => addStudent(formIdx, teacherIdx)}
                                                                    >+添加学生</button>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <button key={`form-${formIdx}-teacher-${teacherIdx}`}
                                                    className="createData-add"
                                                    onClick={() => addTeacher(formIdx, teacherIdx)}
                                                >+添加老师</button>
                                            )
                                        }
                                    })
                                }
                            </section>
                        </li>
                    ))
                }
            </ul>
            <footer>
                <button className='createData-submit btn-blue' onClick={handleSubmit}>创建</button>
            </footer>
            {doubleCheck && <CheckPrompt content={"您填写的内容不会保存，确定要退出吗？"} onClick={createDataClose} />}
        </div>,
        document.body
    )
}