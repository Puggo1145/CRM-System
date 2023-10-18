import { createPortal } from 'react-dom';

import useEditData from '../../../../store/editData';

import BackgroundMask from '../../../../components/BackgroundMask/BackgroundMask';

// utils
import engKeyToCn from '../../../../utils/engKeyToCn';

import './EditData.css';

import closeIcon from '../../../../static/common/close-icon.png';

export default function EditData() {

    const [target, data] = useEditData(state => [state.target, state.data]);

    const formRenderer = (formType: string) => {

    };

    return createPortal(
        <>
            <div className="editData-wrapper board-component">
                <header>
                    <h3>编辑数据</h3>
                    <img src={closeIcon} onClick={() => history.back()} />
                </header>
                <ul className='editData-content'>
                    {
                        Object.entries(data as any).map(([key, value]) => {
                            if (key.split('_')[1] === 'id') return;
                            return (
                                <li className='editData-content-item' key={key}>
                                    <span>{engKeyToCn(key)}</span>
                                    <input type="text" className='form-input' defaultValue={value as string | number} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <BackgroundMask />
        </>,
        document.body
    );
};