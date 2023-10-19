import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { usePrompt } from '../../../../components/prompts/PromptContext';

import useEditData from '../../../../store/editData';
import useUrl from '../../../../store/urls';

import BackgroundMask from '../../../../components/BackgroundMask/BackgroundMask';

// utils
import keyTransformer from '../../../../utils/keyTransformer';

import './EditData.css';

import closeIcon from '../../../../static/common/close-icon.png';
import makeRequest from '../../../../utils/makeRequest';

export default function EditData() {

    const { showCheck, showPrompt } = usePrompt();

    const backendUrl = useUrl(state => state.backendUrl);

    const [target, data] = useEditData(state => [state.target, state.data]);

    const formRef = useRef<HTMLFormElement>(null);

    const formRenderer = (formType: string, defaultValue: string | number, selectOptions: string[], keyName: string) => {
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

    const omitKey = (key: string) => {
        const omitFields = ['id', 'time'];

        return omitFields.includes(key);
    };

    const handleSubmit = async () => {
        // 1. 构造 formData
        const formData = new FormData(formRef.current!);
        const dataOnUpdate = {};
        Object.keys(data as any).forEach(key => {
            if (omitKey(key.split('_')[1])) return;
            Object.assign(dataOnUpdate, { [key]: formData.get(key) });
        });

        // 2. 非空检查
        const nonNullField = ["name", "sex", "age", "class", "phone", "wechat", "type", "status"];
        let nullFlag = true;
        nonNullField.forEach(field => {
            if (!(dataOnUpdate as any)[`${target}_${field}`] && (dataOnUpdate as any).hasOwnProperty(`${target}_${field}`)) {
                showPrompt({
                    content: `${keyTransformer(`${target}_${field}`).name}不能为空`,
                    type: 'error'
                });
                nullFlag = false;
            }
        });
        if (!nullFlag) return;

        const result = await showCheck('是否确认修改？');
        if (!result) return;

        const res = makeRequest({
            method: "PUT",
            url: `${backendUrl}/api/v1/data/${target}/${(data as any)[`${target}_id`]}`,
            data: {
                dataOnUpdate
            }
        });

        if (!('error' in res)) {
            showPrompt({
                content: '修改成功',
                type: 'success'
            });

            setTimeout(() => history.back(), 1500);
        } else {
            showPrompt({
                content: `${res.error}`,
                type: 'error'
            });
        }
    };

    return createPortal(
        <>
            <div className="editData-wrapper board-component">
                <header>
                    <h3>编辑数据</h3>
                    <img src={closeIcon} onClick={() => history.back()} />
                </header>
                <form ref={formRef}>
                    <ul className='editData-content'>
                        {
                            Object.entries(data as any).map(([key, value]) => {
                                if (omitKey(key.split('_')[1])) return;
                                return (
                                    <li className='editData-content-item' key={key}>
                                        <span>{keyTransformer(key).name}</span>
                                        {formRenderer(
                                            keyTransformer(key).formType,
                                            value as string | number,
                                            keyTransformer(key).selectOptions!,
                                            key
                                        )}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </form>
                <section className='editData-fns'>
                    <button className='btn-blue' style={{ backgroundColor: "#999" }} onClick={() => history.back()}>取消</button>
                    <button className='btn-blue' onClick={handleSubmit}>提交</button>
                </section>
            </div>
            <BackgroundMask />
        </>,
        document.body
    );
};