import { useEffect, useState } from 'react';
import '../../style/style.css';

type BackgroundMaskProps = {
  onClick: () => void;
  state: boolean;
};

export default function BackgroundMask({ onClick, state }: BackgroundMaskProps) {
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


  return (
    <div 
        className='background-mask' 
        onClick={onClick} 
        style={{
          opacity: state ? '0.5' : '0',
          display: display ? 'block' : 'none',
        }}
    ></div>
  )
}