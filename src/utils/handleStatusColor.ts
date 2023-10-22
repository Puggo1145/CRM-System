export const taskStatusColor = (status: string) => {
    switch (status) {
        case '待确认':
            return '#6C6C6C'
        case '进行中':
            return '#FF8A00'
        case '待审核':
            return '#3963EB'
        case '已完成':
            return '#30CB5B'
        case '已逾期':
            return '#DE1F1F'
        default:
            return ''
    }
};

export const teacherStatusColor = (status: string) => {
    switch (status) {
        case '未对接':
            return '#6C6C6C'
        case '对接中':
            return '#FF8A00'
        case '对接成功':
            return '#30CB5B'
        case '对接失败':
            return '#DE1F1F'
        default:
            return ''
    }
};

export const studentStatusColor = (status: string) => {
    switch (status) {
        case '未对接':
            return '#6C6C6C'
        case '对接中':
            return '#FF8A00'
        case '已联系':
            return '#3963EB'
        case '未报名':
            return '#DE1F1F'
        case '预报名':
            return '#FF8A00'
        case '全费报名':
            return '#30CB5B'
        case '已入学':
            return '#30CB5B'
        default:
            return ''
    }
};