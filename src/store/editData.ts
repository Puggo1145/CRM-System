import { create } from "zustand";

import { schoolDataType, teacherDataType, studentDataType } from "../types/createDataModeltype";

type EditDataState = {
    target: 'school' | 'teacher' | 'student' | '',
    data: schoolDataType | teacherDataType | studentDataType | null,

    passEditData: (state: Pick<EditDataState, 'target' | 'data'>) => void; 
};

const useEditData = create<EditDataState>(set => ({
    target: '',
    data: null,

    passEditData: (state) => set(() => ({ target: state.target, data: state.data })),
}));

export default useEditData;