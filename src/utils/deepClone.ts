function deepClone(obj: any): any {
    if (obj === null) return null;
    if (typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
        const result = [];
        for (let i = 0; i < obj.length; i++) {
            result[i] = deepClone(obj[i]);
        }
        return result;
    } else {
        const result: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = deepClone(obj[key]);
            }
        }
        return result;
    }
}

export default deepClone;