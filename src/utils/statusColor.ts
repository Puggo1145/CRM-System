export const handleStatusColor = (status: string) => {
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