import { create } from "zustand";

interface employeeType {
    _id: string
    name: string
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
