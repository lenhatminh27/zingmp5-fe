import type {IResponse} from "../types/response.type.ts";
import type {AxiosError} from "axios";
import {notification} from "antd";
import type {IArtist} from "../types/model.type.ts";

export const getErrorMessage = (error: AxiosError) => {
    const errorData: IResponse = (error as AxiosError).response
        ?.data as IResponse
    const errors = Array.isArray(errorData.errors) ? errorData.errors : [];
    errors.forEach((msg) => {
        if (msg) notification.error({message: String(msg)});
    });
    return errors
}

export const formatDuration = (sec?: number) => {
    if (!sec || sec <= 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

export const getArtistNames = (artists: Array<string | IArtist>): string => {
    if (!artists || artists.length === 0) {
        return "Unknown Artist";
    }

    return artists
        .map((artist) => {
            if (typeof artist === "object" && artist !== null && "stageName" in artist) {
                return artist.stageName;
            }
            return String(artist);
        })
        .join(", ");
};