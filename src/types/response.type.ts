export interface IResponse<T = any> {
    code: number;             // 200, 201, 4xx, 5xx
    data: T;                  // payload
    errors?: string[];        // khi lỗi
    timestamp: string;        // ISO time
}
