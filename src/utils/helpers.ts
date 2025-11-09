import type {IErrorResponse} from "../types/response.type.ts";
import type {AxiosError} from "axios";
import {notification} from "antd";

export const getErrorMessage = (error: AxiosError) => {
    const errorData: IErrorResponse = (error as AxiosError).response
        ?.data as IErrorResponse

    if (errorData.details)
        for (const [, value] of Object.entries(errorData.details)) {
            notification.error({
                message: `${value}`,
            })
        }
    else if (errorData.message) {
        console.log(errorData)
        notification.error({
            message: errorData.message,
        })
    }
    return errorData
}