import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAccessToken} from "../store/reducers/auth";
import {instance} from "../config/axiosInstance.tsx";

export const useAxiosInstance = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector(getAccessToken);

    useEffect(() => {
        const reqInterceptor = instance.interceptors.request.use(
            (config) => {
                if (accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );


        return () => {
            instance.interceptors.request.eject(reqInterceptor);
        };
    }, [accessToken, dispatch]);

    return instance;
};
