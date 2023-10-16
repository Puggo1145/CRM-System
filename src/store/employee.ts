import { create } from "zustand";

interface employeeType {
    user_id: string
    username: string
}

type EmployeeState = {
    employeeInfo: employeeType[];

    setEmployeeInfo: (employeeInfo: employeeType[]) => void;
};

const useEmployee = create<EmployeeState>((set) => ({
    employeeInfo: [],

    setEmployeeInfo: (employeeInfo) => set(() => ({ employeeInfo: employeeInfo })),
}));

export default useEmployee;
