import { createPortal } from 'react-dom'

import './CheckPrompt.css'

type CheckPromptProps = {
  content: string,
  onClick: (option: boolean) => void
}

export default function CheckPrompt({ content, onClick }: CheckPromptProps) {
  return createPortal(
    <div className='checkPrompt-wrapper'>
      <p>{content}</p>
      <section className='checkPrompt-checkBtn'>
        <button className='btn-blue' onClick={() => onClick(true)}>确定</button>
        <button className='btn-blue' onClick={() => onClick(false)}>取消</button>
      </section>
    </div>,
    document.body
  )
}

// 使用说明：
/*
  在组件中引入，并传递content和onClick
    content为提示的文本内容
    onClick为点击确定或取消按钮的回调函数，参数为true或false
    例如：
    const createDataClose = (option: boolean) => {
        option && handleComponentOpen('openCreateData')
        setDoubleCheck(false);
    };
*/