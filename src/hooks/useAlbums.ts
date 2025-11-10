import { useState } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { useAxiosInstance } from "./useAxiosInstance";
import type { IResponse } from "../types/response.type";
import { getErrorMessage } from "../utils/helpers";
import type { IAlbum, ISong } from "../types/model.type.ts";

const PATH = {
    list: "/albums",
    create: "/albums/create",
    byId: (id: string) => `/albums/${id}`,
    songs: (id: string) => `/albums/${id}/songs`,
    removeSong: (albumId: string, songId: string) => `/albums/${albumId}/songs/${songId}`,
};

// Convert payload to FormData (similar to useSongs)
const toFormData = (payload: Record<string, unknown>) => {
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

export const useAlbums = () => {
    const instance = useAxiosInstance();
    const [isLoading, setIsLoading] = useState(false);

    const getAlbums = async () => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IAlbum[]>> = await instance.get(PATH.list);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getAlbum = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IAlbum>> = await instance.get(PATH.byId(id));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getAlbumSongs = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<ISong[]>> = await instance.get(PATH.songs(id));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const createAlbum = async (
        payload: { title: string; artist: string[]; status?: string; image?: string },
        files?: { image?: File | null }
    ) => {
        setIsLoading(true);
        try {
            // Always use FormData for multipart/form-data (even without file)
            const fd = toFormData({
                ...payload,
                image: files?.image || undefined,
            });
            const res: AxiosResponse<IResponse<IAlbum>> = await instance.post(
                PATH.create,
                fd,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const updateAlbum = async (
        id: string,
        payload: Partial<IAlbum>,
        files?: { image?: File | null }
    ) => {
        setIsLoading(true);
        try {
            // Always use FormData for multipart/form-data (even without file)
            const fd = toFormData({
                ...payload,
                image: files?.image || undefined,
            });
            const res: AxiosResponse<IResponse<IAlbum>> = await instance.put(
                PATH.byId(id),
                fd,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAlbum = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await instance.delete(PATH.byId(id));
            return res.status === 204 ? true : !!(res as any).data?.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const removeSongFromAlbum = async (albumId: string, songId: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IAlbum>> = await instance.delete(PATH.removeSong(albumId, songId));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, getAlbums, getAlbum, getAlbumSongs, createAlbum, updateAlbum, deleteAlbum, removeSongFromAlbum };
};
