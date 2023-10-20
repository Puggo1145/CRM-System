import { useState } from 'react'

import useCurrentTargetView from '../../../../store/currentTargetView';
import useSelects from '../../../../store/selects';

import './MyCustomer.css'

interface customerDataType {
    _id: string;
    student: string;
    teacher: string;
    employee: string;
    status: string;
    createdAt: string;
}

export default function MyCustomer() {

    const currentTargetView = useCurrentTargetView(state => state.currentTargetView);

    const [customerData, setCustomerData] = useState<customerDataType[]>([
        { _id: '1', student: '学生A', teacher: '班主任A', employee: '员工A', status: '对接成功', createdAt: '2021-09-22' },
        { _id: '2', student: '学生B', teacher: '班主任B', employee: '员工B', status: '对接失败', createdAt: '2021-09-22' },
        { _id: '3', student: '学生C', teacher: '班主任C', employee: '员工C', status: '对接成功', createdAt: '2021-09-22' },
        { _id: '4', student: '学生D', teacher: '班主任D', employee: '员工D', status: '对接失败', createdAt: '2021-09-22' },
        { _id: '5', student: '学生E', teacher: '班主任E', employee: '员工E', status: '对接成功', createdAt: '2021-09-22' },
        { _id: '6', student: '学生F', teacher: '班主任F', employee: '员工F', status: '对接失败', createdAt: '2021-09-22' },
        { _id: '7', student: '学生G', teacher: '班主任G', employee: '员工G', status: '对接成功', createdAt: '2021-09-22' },
        { _id: '8', student: '学生H', teacher: '班主任H', employee: '员工H', status: '对接失败', createdAt: '2021-09-22' },
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
                                    <span className='myCustomer-lists-item-employee'>{item.employee}</span>
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
