const formRenderer = (
    { formType, defaultValue, selectOptions, keyName }: { formType: string, defaultValue: string | number, selectOptions: string[], keyName: string }
) => {
    switch (formType) {
        case 'input':
            return <input name={keyName} type="text" className='form-input' defaultValue={defaultValue} />
        case 'textarea':
            return <textarea name={keyName} className='form-textarea' defaultValue={defaultValue}></textarea>
        case 'select':
            return (
                <select name={keyName} className='form-select' defaultValue={defaultValue}>
                    {
                        selectOptions.map(option => <option value={option} key={option}>{option}</option>)
                    }
                </select>
            )
        case 'date':
            return <input name={keyName} type="date" className='form-date' />
        default:
            return <input type="text" className='form-input' />
    }
};

export default formRenderer;