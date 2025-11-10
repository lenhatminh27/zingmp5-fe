import {useCallback, useState} from "react";
import type {AxiosError, AxiosResponse} from "axios";
import {useAxiosInstance} from "./useAxiosInstance";
import type {IResponse} from "../types/response.type";
import {getErrorMessage} from "../utils/helpers";
import type {ISong, ISongStats} from "../types/model.type.ts";

const PATH = {
    list: "/songs",
    byId: (id: string) => `/songs/${id}`,
    stats: (id: string) => `/songs/${id}/stats`,
};

// multipart arrays theo swagger: artists[] / genres[]
const toFormData = (payload: Record<string, any>) => {
    const fd = new FormData();
    Object.entries(payload || {}).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (v instanceof Blob) {
            fd.append(k, v);
        } else if (Array.isArray(v)) {
            v.forEach((item) => fd.append(`${k}[]`, String(item)));
        } else if (typeof v === "object") {
            fd.append(k, JSON.stringify(v));
        } else {
            fd.append(k, String(v));
        }
    });
    return fd;
};

export const useSongs = () => {
    const instance = useAxiosInstance();
    const [isLoading, setIsLoading] = useState(false);

    const getSongs = useCallback(async () => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<ISong[]>> = await instance.get(PATH.list);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    }, [instance])

    const getSong = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<ISong>> = await instance.get(PATH.byId(id));
            return res.data.data; // BE tự tăng views
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getSongStats = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<ISongStats>> = await instance.get(PATH.stats(id));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    // Tạo; nếu có files: gửi multipart với keys: image, file_path
    const createSong = async (
        payload: Omit<ISong, "_id" | "slug" | "likes" | "views" | "liked_by">,
        files?: { image?: File | null; audio?: File | null }
    ) => {
        setIsLoading(true);
        try {
            if (files?.image || files?.audio) {
                const fd = toFormData({
                    ...payload,
                    image: files?.image || undefined,
                    file_path: files?.audio || undefined,
                });
                const res: AxiosResponse<IResponse<ISong>> =
                    await instance.post(PATH.list, fd, {headers: {"Content-Type": "multipart/form-data"}});
                return res.data.data;
            }
            const res: AxiosResponse<IResponse<ISong>> = await instance.post(PATH.list, payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const updateSong = async (
        id: string,
        payload: Partial<ISong>,
        files?: { image?: File | null; audio?: File | null }
    ) => {
        setIsLoading(true);
        try {
            if (files?.image || files?.audio) {
                const fd = toFormData({
                    ...payload,
                    image: files?.image || undefined,
                    file_path: files?.audio || undefined,
                });
                const res: AxiosResponse<IResponse<ISong>> =
                    await instance.put(PATH.byId(id), fd, {headers: {"Content-Type": "multipart/form-data"}});
                return res.data.data;
            }
            const res: AxiosResponse<IResponse<ISong>> = await instance.put(PATH.byId(id), payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSong = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<string>> = await instance.delete(PATH.byId(id));
            return res.data.data; // "Bài hát đã được xóa thành công"
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const list = getSongs;

    return {
        isLoading,
        list,            // <- thêm alias
        getSongs,
        getSong,
        getSongStats,
        createSong,
        updateSong,
        deleteSong
    };
};
