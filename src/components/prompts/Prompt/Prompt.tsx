import { createPortal } from 'react-dom';

import './Prompt.css';

import errorIcon from '../../../static/common/wrong.png';
import correctIcon from '../../../static/common/correct.png';

export default function Prompt(props: any) {

  return createPortal(
    <div className='prompt-wrapper'>
      <img src={props.type === 'error' ? errorIcon : correctIcon} />
      <p>{props.content}</p>
    </div>,
    document.body
  );
};
