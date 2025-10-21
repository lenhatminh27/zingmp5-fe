import {useEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {getAccessToken, getRefreshToken, logOut, setAccessToken} from "../store/reducers/auth";
import {apiUrl} from "../config/env.ts";
import {instance} from "../config/axiosInstance.tsx";

export const useAxiosInstance = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector(getAccessToken);
    const refreshToken = useSelector(getRefreshToken);

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
        const resInterceptor = instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const {response, config} = error;
                const status = response?.status;

                if ((status === 401) && !config._retry) {
                    if (refreshToken) {
                        try {
                            config._retry = true;
                            const res = await axios.get(`${apiUrl}/auth/refresh-token`, {
                                headers: {
                                    Authorization: `Bearer ${refreshToken}`,
                                },
                            });
                            const newToken = res.data?.data;
                            dispatch(setAccessToken(newToken));
                            config.headers.Authorization = `Bearer ${newToken}`;
                            return instance(config);
                        } catch (err) {
                            dispatch(logOut());
                            window.location.href = "/login";
                            throw err;
                        }
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            instance.interceptors.request.eject(reqInterceptor);
            instance.interceptors.response.eject(resInterceptor);
        };
    }, [accessToken, refreshToken, dispatch, instance]);

    return instance;
};
