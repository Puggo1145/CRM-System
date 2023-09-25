import { useState } from 'react'

import './Database.css'

interface studentType {
  _id: string
  student_name: string
  student_phone: string
  student_wechat: string
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
  const [data, setData] = useState<schoolType[]>([
    {
      _id: 'dcacss',
      school_name: 'xx学院',
      teacher_num: 1,
      students_num: 1,
      teachers: [
        {
          _id: 'dcsassaz',
          teacher_name: '张三',
          teacher_phone: '12345678901',
          teacher_wechat: '12345678901',
          status: '已完成',
          students_num: 1,

          students: [
            {
              _id: 'dcsassaz',
              student_name: '张三',
              student_phone: '12345678901',
              student_wechat: '12345678901',
              status: '已完成',
            }
          ]
        }
      ]
    },
    {
      _id: 'dcacssa',
      school_name: 'xx学院',
      teacher_num: 1,
      students_num: 1,
      teachers: [
        {
          _id: 'dcsassazsc',
          teacher_name: '张三',
          teacher_phone: '12345678901',
          teacher_wechat: '12345678901',
          status: '已完成',
          students_num: 1,

          students: [
            {
              _id: 'dcsassazadca',
              student_name: '张三',
              student_phone: '12345678901',
              student_wechat: '12345678901',
              status: '已完成',
            }
          ]
        }
      ]
    }
  ])

  const handleSchoolOpen = (_id: string) => {
    if (_id === currentOpenedSchool) return setCurrentOpenedSchool('')
    setCurrentOpenedSchool(_id)
  }

  return (
    <div className='database-wrapper'>
      <header className='database-header'>
        <h2>数据库</h2>
      </header>

      <div className='database-content board-component'>
        <header>
          <h3>数据库</h3>
        </header>

        <section className='database-content-functions'>
          <section className='database-content-filter'>
            <select name="object">
              <option value="school">以学校查看</option>
              <option value="school">以班主任查看</option>
              <option value="school">以学生查看</option>
            </select>
            <input type="text" name='database-filter-query' placeholder='请输入要查询的内容' />
          </section>
          <section className='database-content-crud'>
            <button className='database-content-create'>导入数据</button>
          </section>
        </section>
        <div className='spacer'></div>
        <ul className='database-content-data'>
          {
            data.map(school => {
              return (
                // school 层级
                <li key={school._id} className='database-content-data-school' onClick={() => handleSchoolOpen(school._id)}>
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
                  {
                    // teacher 层级
                    currentOpenedSchool === school._id &&
                    <ul className='database-content-data-teachers'>
                      {
                        school.teachers.map(teacher => {
                          return (
                            <li className='database-content-data-teacher'>
                              <h4 className='database-content-data-teacher_name'>{teacher.teacher_name}</h4>
                              <ul className='database-content-data-school_info'>
                                <li>
                                  <span>学生数量:{teacher.students_num}</span>
                                </li>
                                <li>
                                  <span>状态: {teacher.status}</span>
                                </li>
                              </ul>
                            </li>
                          )
                        })
                      }
                    </ul>
                  }
                </li>
              )
            })
          }
        </ul>
      </div>

    </div>
  )
}
