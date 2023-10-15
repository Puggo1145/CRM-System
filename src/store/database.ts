import { create } from "zustand";

import { schoolType, teacherType, studentType } from "../types/createDataModeltype";

type FormType = {
    school: schoolType,
    teachers: {
        teacher: teacherType | null,
        students: (studentType | null)[],
    }[],
};

type fomrState = {
    forms: FormType[],
    setForms: (formType: FormType[]) => void,
};

const useDatabase = create<fomrState>((set) => ({
    forms: [{
        school: {
            school_name: { value: '', label: '学校名称', form: 'input' },
            school_address: { value: '', label: '学校地址', form: 'input' },
            school_remark: { value: '', label: '备注', form: 'textarea' }
        },
        teachers: [{
            teacher: null,
            students: [null]
        }]
    }],

    setForms: (forms) => set(() => ({ forms: forms })),
}));

export default useDatabase;