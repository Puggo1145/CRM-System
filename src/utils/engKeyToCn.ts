const engToCnDict: Record<string, string> = {
    school_id: "学校ID",
    school_name: "学校名称",
    school_address: "学校地址",
    school_remark: "备注",
    create_time: "创建时间",

    teacher_id: "教师ID",
    teacher_name: "姓名",
    teacher_sex: "性别",
    teacher_age: "年龄",
    teacher_class: "毕业班年级",
    teacher_phone: "手机号",
    teacher_wechat: "微信",
    teacher_type: "类型",
    teacher_status: "状态",
    teacher_remark: "备注",

    student_id: "学生ID",
    student_name: "姓名",
    student_sex: "性别",
    student_age: "年龄",
    student_phone: "手机号",
    student_mother_phone: "母亲电话",
    student_father_phone: "父亲电话",
    student_relative_phone: "亲属电话",
    student_wechat: "微信",
    student_type: "类型",
    student_target_school_type: "目标学校类型",
    student_status: "状态",
    student_remark: "备注",
}

export default function engKeyToCn(key: string): string{
    return engToCnDict[key];
}