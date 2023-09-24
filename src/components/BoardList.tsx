import { useState, useEffect } from 'react'

import './BoardList.css'

export default function BoardList(props: any) {

    const [keys, setKeys] = useState<string[]>([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        setKeys(props.keys);
        setData(props.data);
        
    }, [props])

    return (
        <>
            <ul className='boardList'>
                <li className='boardList-headerRow'>
                    {
                        keys.map((item, index) => {
                            return (
                                <span key={index}>{item}</span>
                            )
                        })
                    }
                </li>
                <div className='boardList-content'>
                    {
                        data.map((item, index) => {
                            return (
                                <li key={index} className='boardList-content-item'>
                                    {

                                        Object.values(item).map(i => {
                                            return (
                                                <span>{i as string}</span>
                                            )
                                        })
                                    }
                                </li>
                            )
                        })
                    }
                </div>
            </ul>
        </>
    )
}
