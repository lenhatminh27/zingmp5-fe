import {useState} from "react";
import type {AxiosError, AxiosResponse} from "axios";
import {useAxiosInstance} from "./useAxiosInstance";
import {getErrorMessage} from "../utils/helpers";
import type {IResponse} from "../types/response.type";
import type {IAccount} from "../types/model.type.ts";

const PATH = {
    list: "/accounts",
    byId: (id: string) => `/accounts/${id}`,
};

export const useAccounts = () => {
    const instance = useAxiosInstance();
    const [isLoading, setIsLoading] = useState(false);

    const getAccounts = async () => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IAccount[]>> = await instance.get(PATH.list);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getAccount = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IAccount>> = await instance.get(PATH.byId(id));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    // body: { email, password, roles? }
    const createAccount = async (payload: { email: string; password: string; roles?: string[] }) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<Pick<IAccount, "_id" | "email" | "avatar"> & { roles: string[] }>> =
                await instance.post(PATH.list, payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    // nếu có password -> server tự hash
    const updateAccount = async (id: string, payload: Partial<IAccount> & { password?: string }) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IAccount>> = await instance.put(PATH.byId(id), payload as any);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAccount = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<{ message: string }>> = await instance.delete(PATH.byId(id));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, getAccounts, getAccount, createAccount, updateAccount, deleteAccount};
};
