import { create } from "zustand";

type urlsType = {
    backendUrl: string
}

const useUrl = create<urlsType>((set) => ({
    backendUrl: 'https://yuedajiaoyu.top:3000'
}));

export default useUrl;