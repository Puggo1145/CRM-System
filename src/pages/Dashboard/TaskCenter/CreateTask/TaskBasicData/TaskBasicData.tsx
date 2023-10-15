import './TaskBasicData.css'

export default function TaskBasicData() {
    return (
        <div className='taskBasicData-wrapper board-component'>
            <header>
                <h3>任务基本信息</h3>
            </header>
            <section className='taskBasicData-content'>
                <section className='taskBasicData-content-item'>
                    <label>任务名称</label>
                    <input className='form-input' type="text" placeholder='(可选)'/>
                </section>
                <section className='taskBasicData-content-item'>
                    <label>对接员工</label>
                    <select className='form-input'>
                        <option value="请选择">请选择</option>
                        <option value="1">张三</option>
                        <option value="2">李四</option>
                    </select>
                </section>
                <section className='taskBasicData-content-item'>
                    <label>截止时间</label>
                    <input className='form-input' type="datetime-local" />
                </section>
                <section className='taskBasicData-content-item'>
                    <label>备注</label>
                    <textarea className='form-textarea' placeholder='(可选)'/>
                </section>
            </section>
        </div>
    )
}
