import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../style/style.css';

type BackgroundMaskProps = {
  onClick?: () => void;
  state?: boolean;
};

export default function BackgroundMask({ onClick = () => {}, state = true }: BackgroundMaskProps) {
  const [display, setDisplay] = useState<boolean>(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!state) {
      timeoutId = setTimeout(() => {
        setDisplay(false);
      }, 300);
    } else {
      setDisplay(true);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [state]);


  return createPortal(
    <div 
        className='background-mask' 
        onClick={onClick} 
        style={{
          opacity: state ? '0.5' : '0',
          display: display ? 'block' : 'none',
        }}
    ></div>,
    document.body
  )
}
