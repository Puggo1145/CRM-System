export interface formType {
    value: string
    label: string
    form: string,
    selects?: string[]
}

// model：数据模型， data：后端返回的实际数据
export interface schoolModelType {
    school_name: formType
    school_address: formType
    school_remark?: formType
}
export interface schoolDataType {
    school_id: string
    school_name: string
    school_address: string
    school_remark: string
    create_time: string
}

export interface teacherModelType {
    teacher_name: formType
    teacher_sex: formType
    teacher_age: formType
    teacher_class: formType

    teacher_phone: formType
    teacher_wechat: formType
    
    teacher_type: formType
    teacher_status: formType
    teacher_remark: formType
}
export interface teacherDataType {
    teacher_id: string

    teacher_name: string
    teacher_sex: string
    teacher_age: number
    teacher_class: number

    teacher_phone: string
    teacher_wechat: string
    
    teacher_type: string
    teacher_status: string
    teacher_remark: string

    create_time: string
    school_id: string
}

export interface studentModelType {
    student_name: formType
    student_sex: formType
    student_age: formType
    
    student_phone: formType
    student_mother_phone: formType
    student_father_phone: formType
    student_relative_phone: formType
    student_wechat: formType
    
    student_type: formType
    student_target_school_type: formType
    student_status: formType
    student_remark: formType
}
export interface studentDataType {
    student_id: string

    student_name: string
    student_sex: string
    student_age: number
    
    student_phone: string
    student_mother_phone: string
    student_father_phone: string
    student_relative_phone: string
    student_wechat: string
    
    student_type: string
    student_target_school_type: string
    student_status: string
    student_remark: string

    create_time: string

    school_id: string
    teacher_id: string
}