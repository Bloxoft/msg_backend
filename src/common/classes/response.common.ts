import { APP_VERSION } from "src/config/env.config";

export class ResponseService {
    default({ statusCode, message = 'Request Completed', data, success, url }: { statusCode: number, message?: string, data?: any, success?: boolean, url: string }) {
        const res = {
            data: data,
            path: url,
            message: message,
            success: success || true,
            version: APP_VERSION,
            timestamp: new Date().toISOString(),
            statusCode
        }
        return res;
    }

    error({ statusCode = 400, message = 'Request Failed', error, url }: { statusCode: number, message?: string, error?: any, url: string }) {
        const res = {
            message: message,
            success: false,
            path: url,
            version: APP_VERSION,
            timestamp: new Date().toISOString(),
            statusCode,
            error
        }
        return res;
    }

    success({ statusCode = 200, message = 'Request Successful', data, url }: { statusCode: number, message?: string, data?: any, url: string }) {
        const res = {
            data: data,
            message: message,
            path: url,
            version: APP_VERSION,
            success: true,
            timestamp: new Date().toISOString(),
            statusCode
        }
        return res;
    }


}
