import { create } from "zustand";

interface selectsType {
    // status
    taskStatus: string[]
    teacherStatus: string[]
    studentStatus: string[]
    
    // customer types
    teacherTypes: string[],
    studentTypes: string[],
    studentTargetSchoolType: string[],
};

const useSelects = create<selectsType>(set => ({
    taskStatus: ['请选择', '待确认', '进行中', '待审核', '已完成', '已逾期', '需修改'],
    teacherStatus: ['请选择', '未对接', '对接中', '对接成功', '对接失败'],
    studentStatus: ['请选择','未对接', '已联系', '未报名', '预报名', '全费报名', '已入学'],
    teacherTypes: ['请选择','A: 合作意向强', 'B: 了解观望考虑合作', 'C: 不支持不合作'],
    studentTypes: ['请选择','A: 就读意向强', 'B: 有意向，比较中', 'C: 了解考虑中', 'D: 非目标客户'],
    studentTargetSchoolType: ['请选择', '城院', '公办中职', '普高', '其他学校']
}));

export default useSelects;