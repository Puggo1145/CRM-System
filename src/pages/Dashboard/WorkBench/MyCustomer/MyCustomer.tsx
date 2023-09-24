import { useState } from 'react'

import './MyCustomer.css'

interface customerDataType {
    student: string;
    teacher: string;
    employer: string;
    status: string;
    createdAt: string;
}

export default function MyCustomer() {

    const [customerData, setCustomerData] = useState<customerDataType[]>([
        { student: '学生A', teacher: '班主任A', employer: '员工A', status: '对接成功', createdAt: '2021-09-22' },
        { student: '学生B', teacher: '班主任B', employer: '员工B', status: '对接失败', createdAt: '2021-09-22' },
        { student: '学生C', teacher: '班主任C', employer: '员工C', status: '对接成功', createdAt: '2021-09-22' },
        { student: '学生D', teacher: '班主任D', employer: '员工D', status: '对接失败', createdAt: '2021-09-22' },
        { student: '学生E', teacher: '班主任E', employer: '员工E', status: '对接成功', createdAt: '2021-09-22' },
        { student: '学生F', teacher: '班主任F', employer: '员工F', status: '对接失败', createdAt: '2021-09-22' },
        { student: '学生G', teacher: '班主任G', employer: '员工G', status: '对接成功', createdAt: '2021-09-22' },
        { student: '学生H', teacher: '班主任H', employer: '员工H', status: '对接失败', createdAt: '2021-09-22' },
    ])

    return (
        <div className='myCustomer-wrapper board-component'>
            <header>
                <h3>我的客户</h3>
            </header>
            <section className='myCustomer-filter'>
                <span className='myCustomer-filter-item'>
                    <h6>搜索</h6>
                    <input name="customer-search" type="text" placeholder='输入 学校/班主任/学生 名称' />
                </span>
                <span className='myCustomer-filter-item'>
                    <h6>按班主任筛选</h6>
                    <select name="filter-teacher">
                        <option value="all">全部</option>
                        <option value="teacher1">班主任A</option>
                        <option value="teacher2">班主任B</option>
                    </select>
                </span>
                <span className='myCustomer-filter-item'>
                    <h6>按对接员工筛选</h6>
                    <select name="filter-employer">
                        <option value="all">全部</option>
                        <option value="employer1">员工A</option>
                        <option value="employer2">员工B</option>
                    </select>
                </span>
                <span className='myCustomer-filter-item'>
                    <h6>状态</h6>
                    <select name="filter-status">
                        <option value="all">全部</option>
                        <option value="status1">对接成功</option>
                        <option value="status2">对接失败</option>
                    </select>
                </span>
            </section>
            <ul className='myCustomer-lists'>
                <li className='myCustomer-lists-headerRow'>
                    <span>学生</span>
                    <span>班主任</span>
                    <span>对接员工</span>
                    <span>状态</span>
                    <span>创建时间</span>
                </li>
                <div className='myCustomer-lists-content'>
                    {
                        customerData.map(item => {
                            return (
                                <li key={item.student} className='myCustomer-lists-item'>
                                    <span className='myCustomer-lists-item-student'>{item.student}</span>
                                    <span className='myCustomer-lists-item-teacher'>{item.teacher}</span>
                                    <span className='myCustomer-lists-item-employer'>{item.employer}</span>
                                    <span className='myCustomer-lists-item-status'>{item.status}</span>
                                    <span className='myCustomer-lists-item-createdAt'>{item.createdAt}</span>
                                </li>
                            )
                        })
                    }
                </div>
            </ul>
        </div>
    )
}
