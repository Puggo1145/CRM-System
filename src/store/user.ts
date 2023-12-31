import { create } from "zustand";

type UserState = {
    userInfo: {
        username: string | null;
        role: 'admin' | 'user' | null;
    };

    setUserInfo: (info: Partial<UserState['userInfo']>) => void;
};

const useUser = create<UserState>((set) => ({
    userInfo: {
        username: null,
        role: null,
    },

    setUserInfo: (info) => set((state) => ({
        ...state,
        userInfo: {
            ...state.userInfo,
            ...info,
        },
    })),
}));

export default useUser;
