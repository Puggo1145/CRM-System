import './TaskBasicData.css'

import useEmployee from '../../../../../store/employee';

export default function TaskBasicData() {

    const employeeInfo = useEmployee(state => state.employeeInfo);

    return (
        <div className='taskBasicData-wrapper board-component'>
            <header>
                <h3>任务基本信息</h3>
            </header>
            <section className='taskBasicData-content'>
                <section className='taskBasicData-content-item'>
                    <label>任务名称</label>
                    <input name="task_name" className='form-input' type="text" placeholder='(可选)'/>
                </section>
                <section className='taskBasicData-content-item'>
                    <label>对接员工</label>
                    <select className='form-input' name="employee">
                        {
                            employeeInfo.map(item => {
                                return (
                                    <option value={item.user_id} key={item.user_id}>{item.username}</option>
                                )
                            })
                        }
                    </select>
                </section>
                <section className='taskBasicData-content-item'>
                    <label>截止时间</label>
                    <input name="deadline" className='form-input' type="datetime-local" />
                </section>
                <section className='taskBasicData-content-item'>
                    <label>备注</label>
                    <textarea name="task_remark" className='form-textarea' placeholder='(可选)'/>
                </section>
            </section>
        </div>
    )
}
