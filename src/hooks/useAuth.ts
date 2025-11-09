import {useState} from "react";
import type {AxiosError, AxiosResponse} from "axios";
import {useAxiosInstance} from "./useAxiosInstance";
import type {IResponse} from "../types/response.type";
import {getErrorMessage} from "../utils/helpers";
import type {IAccount} from "../types/model.type.ts";

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    account: Pick<IAccount, "_id" | "email" | "avatar"> & { roles: string[] }; // roles là tên
}

export interface ISignUpRequest {
    email: string;
    password: string;
}

export const useAuth = () => {
    const instance = useAxiosInstance();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (payload: ILoginRequest) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<ILoginResponse>> =
                await instance.post("/auth/sign-in", payload);
            return res.data.data;
        } catch (error) {
            getErrorMessage(error as AxiosError);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (payload: ISignUpRequest) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<Pick<IAccount, "_id" | "email" | "avatar"> & { roles: string[] }>> =
                await instance.post("/auth/sign-up", payload);
            return res.data.data;
        } catch (error) {
            getErrorMessage(error as AxiosError);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, login, signUp};
};
