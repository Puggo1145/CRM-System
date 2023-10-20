import { create } from 'zustand';

type CurrentTargetView = {
    currentTargetView: 'teacher' | 'student';

    setCurrentTargetView: (currentTargetView: 'teacher' | 'student') => void;
};

const useCurrentTargetView = create<CurrentTargetView>((set) => ({
    currentTargetView: 'teacher',

    setCurrentTargetView: (currentTargetView: 'teacher' | 'student') => set({ currentTargetView }),
}));

export default useCurrentTargetView;