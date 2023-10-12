import { useState } from 'react'
import { Link } from 'react-router-dom'

import CreateData from './CreateData/CreateData'

import { handleStatusColor } from '../../../utils/statusColor'

import './Database.css'

interface studentType {
  _id: string
  student_name: string
  student_phone: string
  student_wechat: string
  employee: string
  status: string
}

interface teacherType {
  _id: string
  teacher_name: string
  teacher_phone: string
  teacher_wechat: string
  status: string
  students_num: number

  students: studentType[]
}

interface schoolType {
  _id: string
  school_name: string
  teacher_num: number
  students_num: number
  teachers: teacherType[]
}

export default function Database() {

  const [currentOpenedSchool, setCurrentOpenedSchool] = useState<string>('');
  const [currentOpenedTeacher, setCurrentOpenedTeacher] = useState<string>('');
  const [data, setData] = useState<schoolType[]>([
    
  ])

  const handleSchoolOpen = (_id: string) => {
    if (_id === currentOpenedSchool) return setCurrentOpenedSchool('')
    setCurrentOpenedSchool(_id)
  }

  const handleTeacherOpen = (_id: string) => {
    if (_id === currentOpenedTeacher) return setCurrentOpenedTeacher('')
    setCurrentOpenedTeacher(_id)
  }

  return (
    <div className='database-wrapper'>
      <CreateData />
      <header className='database-header'>
        <h2>数据库</h2>
      </header>

      <div className='database-content board-component'>
        <header>
          <h3>数据库</h3>
        </header>

        <section className='database-content-functions'>
          <section className='database-content-filter'>
            <input type="text" name='database-filter-query' placeholder='请输入要查询的内容' />
          </section>
          <section className='database-content-crud'>
            <button className='database-content-create btn-blue'>添加数据</button>
            <button className='database-content-create btn-blue'>导入数据</button>
          </section>
        </section>
        <div className='spacer'></div>
        <ul className='database-content-data'>
          {
            data.map(school => {
              return (
                <>
                  <li 
                    key={school._id} 
                    className={`database-content-data-school ${ currentOpenedSchool === school._id && 'database-selected' }`} 
                    onClick={() => handleSchoolOpen(school._id)} 
                    style={{backgroundColor: currentOpenedSchool === school._id ? '#f5f5f5' : ''}}
                  >
                    <h4 className='database-content-data-school_name'>{school.school_name}</h4>
                    <ul className='database-content-data-school_info'>
                      <li>
                        <span>班主任数量</span>
                        <span>{school.teacher_num}</span>
                      </li>
                      <li>
                        <span>学生数量</span>
                        <span>{school.students_num}</span>
                      </li>
                    </ul>
                  </li>
                  {
                    // teacher 层级 //////////////////////////////////////////////////////////
                    currentOpenedSchool === school._id &&
                    <ul className='database-content-data-teachers'>
                      {
                        school.teachers.map(teacher => {
                          return (
                            <>
                              <li 
                                key={teacher._id} 
                                className={`database-content-data-teacher ${ currentOpenedTeacher === teacher._id && 'database-selected' }`} 
                                onClick={() => handleTeacherOpen(teacher._id)}
                                style={{backgroundColor: currentOpenedTeacher === teacher._id ? '#f5f5f5' : ''}}
                              >
                                <div className='database-content-data-teacher_name'>
                                  <span>班主任名称</span>
                                  <span>{teacher.teacher_name}</span>
                                </div>
                                <div>
                                  <span>学生数量</span>
                                  <span>{teacher.students_num}</span>
                                </div>
                                <div>
                                  <span>状态</span>
                                  <span style={{color: handleStatusColor(teacher.status)}}>{teacher.status}</span>
                                </div>
                                <Link to={'#'}>查看详情</Link>
                              </li>
                              {
                                // student 层级 //////////////////////////////////////////////////////////
                                currentOpenedTeacher === teacher._id &&
                                <ul className='database-content-data-students'>
                                  <li className='database-headerRow'>
                                    <span>学生名称</span>
                                    <span>对接员工</span>
                                    <span>状态</span>
                                  </li>
                                  {
                                    teacher.students.map(student => {
                                      return (
                                        <li key={student._id} className='database-content-data-student'>
                                          <span className='database-content-data-student_name'>{student.student_name}</span>
                                          <span>{student.employee}</span>
                                          <span style={{color: handleStatusColor(student.status)}}>{student.status}</span>
                                        </li>
                                      )
                                    })
                                  }
                                </ul>
                              }
                            </>
                          )
                        })
                      }
                    </ul>
                  }
                </>
              )
            })
          }
        </ul>
      </div>

    </div>
  )
}
