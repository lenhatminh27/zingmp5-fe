import {useState} from "react";
import type {AxiosError, AxiosResponse} from "axios";
import {useAxiosInstance} from "./useAxiosInstance";
import type {IResponse} from "../types/response.type";
import {getErrorMessage} from "../utils/helpers";
import type {IAccount} from "../types/model.type.ts";
import {useDispatch} from "react-redux";
import {loginSuccess, logOut} from "../store/reducers/auth";

// Giữ nguyên interface như bạn đang dùng
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
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (payload: ILoginRequest) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<ILoginResponse>> = await instance.post(
                "/auth/sign-in",
                payload
            );
            const data = res.data.data; // { token, account{_id,email,avatar,roles[]} }

            // Lưu vào Redux theo slice bạn đã sửa (hỗ trợ dạng payload từ BE)
            dispatch(loginSuccess(data));

            return data;
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
            const res: AxiosResponse<
                IResponse<Pick<IAccount, "_id" | "email" | "avatar"> & { roles: string[] }>
            > = await instance.post("/auth/sign-up", payload);
            // BE không trả token ở sign-up → không dispatch loginSuccess ở đây
            return res.data.data;
        } catch (error) {
            getErrorMessage(error as AxiosError);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Tuỳ chọn: logout tiện dụng cho UI
    const logout = () => {
        dispatch(logOut());
    };

    return {isLoading, login, signUp, logout};
};
