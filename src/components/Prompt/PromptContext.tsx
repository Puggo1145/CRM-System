import { createContext, useContext, ReactNode, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import Prompt from './Prompt';

interface PromptContextType {
    showPrompt: (info: { content: string, type: 'error' | 'correct' }) => void;
}

const PromptContext = createContext<PromptContextType | null>(null);

export function PromptProvider({ children }: { children: ReactNode }) {
    const [prompt, setPrompt] = useState<{ content?: string, type?: 'error' | 'correct' }>({});
    const [isPromptShow, setIsPromptShow] = useState<boolean>(false);

    const showPrompt = (info: { content: string, type: 'error' | 'correct' }) => {
        setPrompt({ ...info });
        setIsPromptShow(true);
        setTimeout(() => {
            setIsPromptShow(false);
        }, 3000);
    };

    return (
        <PromptContext.Provider value={{ showPrompt }}>
            {children}
            <CSSTransition
                in={isPromptShow}
                timeout={300} 
                classNames="prompt"
                unmountOnExit
            >
                <Prompt {...prompt} />
            </CSSTransition>
        </PromptContext.Provider>
    );
};

export function usePrompt() {
    const context = useContext(PromptContext);
    if (!context) {
        throw new Error('usePrompt must be used within a PromptProvider');
    }
    return context;
};