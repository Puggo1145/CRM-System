import { create } from "zustand";

type urlsType = {
    backendUrl: string
}

const useUrl = create<urlsType>((set) => ({
    backendUrl: 'http://localhost:3000'
}));

export default useUrl;