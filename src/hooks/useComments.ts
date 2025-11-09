import {useState} from "react";
import type {AxiosError, AxiosResponse} from "axios";
import {useAxiosInstance} from "./useAxiosInstance";
import type {IResponse} from "../types/response.type";
import {getErrorMessage} from "../utils/helpers";
import type {IComment} from "../types/model.type.ts";

const PATH = {
    list: "/comments",
    byId: (id: string) => `/comments/${id}`,
    replies: (id: string) => `/comments/${id}/replies`,
};

export const useComments = () => {
    const instance = useAxiosInstance();
    const [isLoading, setIsLoading] = useState(false);

    const getComments = async (songId?: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IComment[]>> = await instance.get(PATH.list, {
                params: songId ? {song_id: songId} : undefined,
            });
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getComment = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IComment>> = await instance.get(PATH.byId(id));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getReplies = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IComment[]>> = await instance.get(PATH.replies(id));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    // Không gửi account_id: server lấy từ req.user.id
    const createComment = async (payload: { content: string; song_id: string; parent_id?: string }) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IComment>> = await instance.post(PATH.list, payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const updateComment = async (id: string, payload: { content: string }) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IComment>> = await instance.put(PATH.byId(id), payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteComment = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<{ message: string }>> = await instance.delete(PATH.byId(id));
            return res.data.data; // "Xóa comment thành công"
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return {isLoading, getComments, getComment, getReplies, createComment, updateComment, deleteComment};
};
