import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { appEnv } from 'src/config/env.config';
import { ResponseService } from '../classes/response.common';


interface HttpExceptionResponse {
    statusCode: number;
    error: string;
}

interface CustomHttpExceptionResponse extends HttpExceptionResponse {
    path: string;
    method: string;
    timeStamp: Date;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {

        if (host.getType() == 'rpc') {
            return {
                error: exception
            }
        }


        if (host.getType() == 'http') {
            const ctx = host.switchToHttp();

            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();

            let status: HttpStatus;
            let errorMessage: string;

            if (exception instanceof HttpException) {
                status = exception.getStatus();
                const errorResponse = exception.getResponse();
                errorMessage =
                    (errorResponse as BadRequestException).message ||
                    (errorResponse as HttpExceptionResponse).error ||
                    exception.message;

                if (
                    exception instanceof UnauthorizedException &&
                    errorMessage === 'Unauthorized'
                ) {
                    errorMessage = 'You must log in first';
                }
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                errorMessage =
                    'An unexpected error occurred. Our apologies for the inconvenience.';
            }

            const errorResponse = this.getErrorResponse(status, errorMessage, request);
            const errorLog = this.getErrorLog(errorResponse, request, exception);
            this.writeLog(errorLog);
            response.status(status).json(errorResponse);
        }

    }

    private getErrorResponse = (
        status: HttpStatus,
        errorMessage: string,
        request: Request,
    ): any => (new ResponseService().error({ statusCode: status, message: 'Error Occured', url: request.url, error: errorMessage, }));

    private getErrorLog = (
        errorResponse: CustomHttpExceptionResponse,
        request: Request,
        exception: Error,
    ): string => {
        const { statusCode } = errorResponse;
        const { method, url } = request;
        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n
      ${JSON.stringify(errorResponse)}\n
      ${exception.stack}\n\n`;
        return errorLog;
    };

    private writeLog = (errorLog: string): void => {
        if (appEnv !== 'test') {
            Logger.error(errorLog);
        }
    };
}