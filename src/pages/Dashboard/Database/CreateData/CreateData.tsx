import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

// stores
import useSelects from '../../../../store/selects';

import BackgroundMask from '../../../../components/BackgroundMask/BackgroundMask';

// types
import { schoolType } from '../../../../types/createDataModeltype';
import { teacherType } from '../../../../types/createDataModeltype';
import { studentType } from '../../../../types/createDataModeltype';

import './CreateData.css'

import closeIcon from '../../../../static/common/close-icon.png'
import openIcon from '../../../../static/common/open.png';

type FormType = {
    school: schoolType,
    teachers: {
        teacher: teacherType | null,
        students: (studentType | null)[],
    }[],
}

export default function CreateData() {

    const selects = useSelects(state => state);

    const [schoolModel, setSchoolModel] = useState<schoolType>({
        school_name: { label: '学校名称', form: 'input' },
        school_address: { label: '学校地址', form: 'input' },
        school_remark: { label: '备注', form: 'textarea' },
    });
    const [teacherModel, setTeacherModel] = useState<teacherType>({
        teacher_name: { label: '教师姓名', form: 'input' },
        teacher_sex: { label: '性别', form: 'select', selects: ['男', '女'] },
        teacher_age: { label: '年龄', form: 'input' },
        teacher_class: { label: '班级', form: 'input' },

        teacher_phone: { label: '手机号', form: 'input' },
        teacher_wechat: { label: '微信号', form: 'input' },

        teacher_type: { label: '类型', form: 'select', selects: selects.teacherTypes },
        status: { label: '状态', form: 'select', selects: selects.teacherStatus },
        teacher_remark: { label: '备注', form: 'textarea' },
    });
    const [studentModel, setStudentModel] = useState<studentType>({
        student_name: { label: '学生姓名', form: 'input' },
        student_sex: { label: '性别', form: 'select', selects: ['男', '女'] },
        student_age: { label: '年龄', form: 'input' },

        student_phone: { label: '手机号', form: 'input' },
        student_mother_phone: { label: '母亲手机号', form: 'input' },
        student_father_phone: { label: '父亲手机号', form: 'input' },
        student_relative_phone: { label: '亲属手机号', form: 'input' },
        student_wechat: { label: '微信号', form: 'input' },

        student_type: { label: '类型', form: 'select', selects: selects.studentTypes },
        student_target_school_type: { label: '目标学校类型', form: 'select', selects: selects.studentTargetSchoolType },
        status: { label: '状态', form: 'select', selects: selects.studentStatus },
        student_remark: { label: '备注', form: 'textarea' },
    });



    const [forms, setForms] = useState<FormType[]>([
        {
            school: schoolModel,
            teachers: [{
                teacher: null,
                students: [null]
            }]
        }
    ]);
    const [isTeacherOpened, setIsTeacherOpened] = useState<boolean[]>([]);
    const [isStudentOpened, setIsStudentOpened] = useState<(boolean | [])[][]>([[]]);

    const addTeacher = (formIdx: number, teacherIdx: number) => {
        const newForms = [...forms];
        newForms[formIdx].teachers.splice(-1, 0, {
            teacher: teacherModel,
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
        const newForms = [...forms];
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
        newForms[formIdx].teachers[teacherIdx].students.splice(-1, 0, studentModel);
        setForms(newForms);

        const newStudentOpened = [...isStudentOpened];
        newStudentOpened[teacherIdx].push(true);
        setIsStudentOpened(newStudentOpened);
    };
    const deleteStudent = (formIdx: number, teacherIdx: number, studentIdx: number) => {
        const newForms = [...forms];
        newForms[formIdx].teachers[teacherIdx].students.splice(studentIdx, 1);
        setForms(newForms);

        const newStudentOpened = [...isStudentOpened];
        newStudentOpened[teacherIdx].splice(studentIdx, 1);
        setIsStudentOpened(newStudentOpened);
    }

    const renderForm = (formName: string, label: string, selects?: string[]) => {
        switch (formName) {
            case 'input':
                return <input className='form-input' type='text' placeholder={`请输入${label}`} />;
            case 'textarea':
                return <textarea className='form-textarea' placeholder={`请输入${label}`} />;
            case 'select':
                return (
                    <select className='form-select'>
                        {
                            selects?.map((select, selectIdx) => {
                                return <option className='form-option' key={`select-${selectIdx}`}>{select}</option>
                            })
                        }
                    </select>
                );
            default:
                return <input type='text' placeholder={`请输入${label}`} />;
        }
    };

    // useEffect(() => {
    //     console.log('teachers：')
    //     console.log(isTeacherOpened);
    // }, [isTeacherOpened])
    // useEffect(() => {
    //     console.log("student:");
    //     console.log(isStudentOpened );
    // }, [isStudentOpened]);

    return createPortal(
        <div className='createData-wrapper'>
            <header>
                <h3>创建数据</h3>
                <img src={closeIcon} />
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
                                            {renderForm(value.form, value.label)}
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
                                                            <h4>班主任{teacherIdx + 1}</h4>
                                                        </span>
                                                        <span className='createData-formData-header-right'>
                                                            <img src={closeIcon} onClick={() => deleteTeacher(formIdx, teacherIdx)} />
                                                        </span>
                                                    </div>
                                                    {
                                                        Object.entries(teacherModel).map(([key, value]) => (
                                                            <section key={`form-${formIdx}-teacher-${teacherIdx}-${key}`} className='createData-formData-item'>
                                                                <label>{value.label}</label>
                                                                {renderForm(value.form, value.label, value.selects)}
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
                                                                                <h4>学生{studentIdx + 1}</h4>
                                                                            </span>
                                                                            <span className='createData-formData-header-right'>
                                                                                <img src={closeIcon} onClick={() => deleteStudent(formIdx, teacherIdx, studentIdx)} />
                                                                            </span>
                                                                        </div>
                                                                        {
                                                                            Object.entries(studentModel).map(([key, value]) => (
                                                                                <div key={`form-${formIdx}-student-${studentIdx}-${key}`} className='createData-formData-item'>
                                                                                    <label>{value.label}</label>
                                                                                    {renderForm(value.form, value.label, value.selects)}
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
                <button className='createData-submit btn-blue'>创建</button>
            </footer>
        </div>,
        document.body
    )
}