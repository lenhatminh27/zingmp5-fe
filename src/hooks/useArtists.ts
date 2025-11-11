
import { useState } from "react";
import type { AxiosError, AxiosResponse } from "axios";
import { useAxiosInstance } from "./useAxiosInstance";
import type { IResponse } from "../types/response.type";
import { getErrorMessage } from "../utils/helpers";
import type { IArtist, ISong, IAlbum } from "../types/model.type.ts";

const PATH = {
    list: "/artists",
    byId: (id: string) => `/artists/${id}`,
    byUserId: (userId: string) => `/artists/user/${userId}`,
    songs: (artistId: string) => `/artists/${artistId}/songs`,
    albums: (artistId: string) => `/artists/${artistId}/albums`,
};

export const useArtists = () => {
    const instance = useAxiosInstance();
    const [isLoading, setIsLoading] = useState(false);

    const getArtists = async () => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IArtist[]>> = await instance.get(PATH.list);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getArtist = async (id: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IArtist>> = await instance.get(PATH.byId(id));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getArtistByUserId = async (userId: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IArtist>> = await instance.get(PATH.byUserId(userId));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const createArtist = async (payload: Pick<IArtist, "userId" | "stageName"> & Partial<IArtist>) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IArtist>> = await instance.post(PATH.list, payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const updateArtist = async (id: string, payload: Partial<IArtist>) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IArtist>> = await instance.put(PATH.byId(id), payload);
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getArtistSongs = async (artistId: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<ISong[]>> = await instance.get(PATH.songs(artistId));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const getArtistAlbums = async (artistId: string) => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<IResponse<IAlbum[]>> = await instance.get(PATH.albums(artistId));
            return res.data.data;
        } catch (e) {
            getErrorMessage(e as AxiosError);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, getArtists, getArtist, getArtistByUserId, createArtist, updateArtist, getArtistSongs, getArtistAlbums };
};
