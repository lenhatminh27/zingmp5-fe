import { useState, useCallback } from "react";
import { instance } from "../config/axiosInstance";
import type { AxiosError } from "axios";

export const useAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ============ USERS ============
    const getUsers = useCallback(async (page = 1, limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.get(`/api/admin/accounts`, {
                params: { page, limit },
            });
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to fetch users";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getUserById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.get(`/api/admin/accounts/${id}`);
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to fetch user";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.delete(`/api/admin/accounts/${id}`);
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to delete user";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ============ ALBUMS ============
    const getAlbums = useCallback(async (page = 1, limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.get(`/albums`, {
                params: { page, limit },
            });
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to fetch albums";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getAlbumById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.get(`/albums/${id}`);
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to fetch album";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ============ SONGS ============
    const getSongs = useCallback(async (page = 1, limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.get(`/songs`, {
                params: { page, limit },
            });
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to fetch songs";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getSongById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.get(`/songs/${id}`);
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to fetch song";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteSong = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.delete(`/songs/${id}`);
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to delete song";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ============ GENRES ============
    const getGenres = useCallback(async (page = 1, limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.get(`/genres`, {
                params: { page, limit },
            });
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to fetch genres";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createGenre = useCallback(async (genreData: { name: string; description?: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.post(`/genres/create`, genreData);
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to create genre";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateGenre = useCallback(async (id: string, genreData: { name?: string; description?: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.put(`/genres/${id}`, genreData);
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to update genre";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteGenre = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await instance.delete(`/genres/${id}`);
            return response.data.data;
        } catch (err) {
            const errorMsg = (err as AxiosError<{ errors?: string[] }>).response?.data?.errors?.[0] || "Failed to delete genre";
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        // Users
        getUsers,
        getUserById,
        deleteUser,
        // Albums
        getAlbums,
        getAlbumById,
        // Songs
        getSongs,
        getSongById,
        deleteSong,
        // Genres
        getGenres,
        createGenre,
        updateGenre,
        deleteGenre,
    };
};
