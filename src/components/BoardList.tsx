import { useState, useEffect } from 'react'

import './BoardList.css'

export default function BoardList(props: any) {

    const [keys, setKeys] = useState<string[]>([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        setKeys(props.keys);
        setData(props.data);
        
    }, [props])

    const handleStatusColor = (status: string) => {
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

    return (
        <>
            <ul className='boardList'>
                <li className='boardList-headerRow'>
                    {
                        keys.map((item, index) => {
                            return (
                                <span key={'item' + index}>{item}</span>
                            )
                        })
                    }
                </li>
                <div className='boardList-content'>
                {
                        data.map((item, index) => {
                            return (
                                <li key={'item' + index} className='boardList-content-item'>
                                    {
                                        Object.entries(item)
                                            .filter(([key]) => key !== '_id') // 过滤掉_id
                                            .map(([key, value], idx) => {
                                                return (
                                                    <span 
                                                        key={`item-${index}-${idx}`}
                                                        style={key === 'status' ? { color: handleStatusColor(value as string) } : {}}
                                                    >
                                                        {value as string}
                                                    </span>
                                                );
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
