import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import Prompt from './Prompt/Prompt';
import CheckPrompt from './CheckPrompt/CheckPrompt';

interface PromptProps {
    content: string,
    type: 'error' | 'success'
}
interface checkProps {
    content: string,
    onClick: (option: boolean) => void
}
interface PromptContextType {
    showPrompt: (info: PromptProps) => void;
    showCheck: (content: string) => Promise<boolean>
}

const PromptContext = createContext<PromptContextType | null>(null);

export function PromptProvider({ children }: { children: ReactNode }) {
    const [prompt, setPrompt] = useState<PromptProps>();
    const [isPromptShow, setIsPromptShow] = useState<boolean>(false);
    const showPrompt = (info: PromptProps) => {
        setPrompt({ ...info });
        setIsPromptShow(true);
        setTimeout(() => {
            setIsPromptShow(false);
        }, 3000);
    };

    const [isCheckShow, setIsCheckShow] = useState<boolean>(false); // 控制 context 内部的 CheckPrompt 组件是否显示
    const [checkProps, setCheckProps] = useState<checkProps>(); // checkPrompt 所需的 props
    const showCheck = (content: string): Promise<boolean> => { // 调用 checkPrompt
        return new Promise((resolve) => {
            setCheckProps({
                content,
                onClick: (bool: boolean) => {
                    setIsCheckShow(false);
                    
                    resolve(bool);
                }
            });

            setIsCheckShow(true);
        });
    };

    return (
        <PromptContext.Provider value={{ showPrompt, showCheck }}>
            {children}
            <CSSTransition
                in={isPromptShow}
                timeout={300} 
                classNames="prompt"
                unmountOnExit
            >
                <Prompt {...prompt} />
            </CSSTransition>
            <CSSTransition
                in={isCheckShow}
                timeout={300} 
                classNames="checkPrompt"
                unmountOnExit
            >
                <CheckPrompt {...checkProps!}/>
            </CSSTransition>
        </PromptContext.Provider>
    );
};

// 暴露 hook
export function usePrompt() {
    const context = useContext(PromptContext);
    if (!context) {
        throw new Error('usePrompt must be used within a PromptProvider');
    }
    return context;
};