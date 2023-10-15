import axios, { AxiosResponse } from "axios";

interface RequestParams {
    url: string;
    method: "GET" | "POST";
    data?: any;
    headers?: any;
};

type resError = {
    status: number;
    error: string;
};

const makeRequest = async (params: RequestParams): Promise<AxiosResponse | resError> => {
    try {
        const response = await axios({
            method: params.method,
            url: params.url,
            data: params.data,
            headers: params.headers,
            withCredentials: true
        });

        return response;
    } catch (err: any) {
        if (err.response && err.response.data) {
            return {
                status: err.response.status as number,
                error: err.response.data.message
            };
        } else {
            return {
                status: 500,
                error: "Something went wrong"
            };
        }
    }
};

export default makeRequest;
