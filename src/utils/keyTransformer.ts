type FormType = 'input' | 'textarea' | 'select' | 'date';

interface keyDictValue {
    name: string;
    formType: FormType;
    selectOptions?: string[];
}

const keyDict: Record<string, keyDictValue> = {
    school_id: { name: '学校ID', formType: 'input' },
    school_name: { name: '学校名称', formType: 'input' },
    school_address: { name: '学校地址', formType: 'input' },
    school_remark: { name: '备注', formType: 'textarea' },
    create_time: { name: '创建时间', formType: 'date' },

    teacher_id: { name: '教师ID', formType: 'input' },
    teacher_name: { name: '姓名', formType: 'input' },
    teacher_sex: { name: '性别', formType: 'select', selectOptions: ['男', '女'] },
    teacher_age: { name: '年龄', formType: 'input' },
    teacher_class: { name: '毕业班年级', formType: 'input' },
    teacher_phone: { name: '手机号', formType: 'input' },
    teacher_wechat: { name: '微信', formType: 'input' },
    teacher_type: { name: '类型', formType: 'select', selectOptions: ['A: 合作意向强', 'B: 了解观望考虑合作', 'C: 不支持不合作'] },
    teacher_status: { name: '状态', formType: 'select', selectOptions: ['未对接', '对接中', '对接成功', '对接失败']},
    teacher_remark: { name: '备注', formType: 'textarea' },

    student_id: { name: '学生ID', formType: 'input' },
    student_name: { name: '姓名', formType: 'input' },
    student_sex: { name: '性别', formType: 'select', selectOptions: ['男', '女'] },
    student_age: { name: '年龄', formType: 'input' },
    student_phone: { name: '手机号', formType: 'input' },
    student_mother_phone: { name: '母亲电话', formType: 'input' },
    student_father_phone: { name: '父亲电话', formType: 'input' },
    student_relative_phone: { name: '亲属电话', formType: 'input' },
    student_wechat: { name: '微信', formType: 'input' },
    student_type: { name: '类型', formType: 'select', selectOptions: ['A: 就读意向强', 'B: 有意向，比较中', 'C: 了解考虑中', 'D: 非目标客户'] },
    student_target_school_type: { name: '目标学校类型', formType: 'select', selectOptions: ['城院', '公办中职', '普高', '其他学校'] },
    student_status: { name: '状态', formType: 'select', selectOptions: ['未对接', '对接中', '已联系', '未报名', '预报名', '全费报名', '已入学'] },
    student_remark: { name: '备注', formType: 'textarea' },

    task_name: { name: '任务名称', formType: 'input' },
    task_target: { name: '任务目标', formType: 'input' },
    deadline: { name: '截止日期', formType: 'date' },
    task_remark: { name: '备注', formType: 'textarea' },
    status: { name: '状态', formType: 'select' },
};

export default function keyTransformer(key: string): keyDictValue {
    return keyDict[key];
};