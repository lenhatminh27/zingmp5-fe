import {useState} from "react";
import type {AxiosError, AxiosResponse} from "axios";
import {useAxiosInstance} from "./useAxiosInstance";
import type {IResponse} from "../types/response.type";
import {getErrorMessage} from "../utils/helpers";
import type {IGenre} from "../types/model.type.ts";

const PATH = {
    list: "/genres",
    create: "/genres/create",
    byId: (id: string) => `/genres/${id}`,
};

export const useGenres = () => {
    const instance = useAxiosInstance();
    const [isLoading, setIsLoading] = useState(false);

    const getGenres = async () => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IGenre[]>> = await instance.get(PATH.list);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const createGenre = async (payload: Pick<IGenre, "name" | "description" | "thumbnail">) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IGenre>> = await instance.post(PATH.create, payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const updateGenre = async (id: string, payload: Partial<IGenre>) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IGenre>> = await instance.put(PATH.byId(id), payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteGenre = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await instance.delete(PATH.byId(id));
            // router dự kiến trả 204 No Content
            return res.status === 204 ? true : !!(res as any).data?.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, getGenres, createGenre, updateGenre, deleteGenre};
};
