interface formType {
    label: string
    form: string,
    selects?: string[]
}

export interface schoolType {
    // school_id: string
    school_name: formType
    school_address: formType
    // school_type: formType
    school_remark?: formType
}

export interface teacherType {
    // teacher_id: formType
    teacher_name: formType
    teacher_sex: formType
    teacher_age: formType
    teacher_class: formType

    teacher_phone: formType
    teacher_wechat: formType
    
    teacher_type: formType
    status: formType
    teacher_remark: formType
}

export interface studentType {
    // student_id: formType
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
    status: formType
    student_remark: formType
}