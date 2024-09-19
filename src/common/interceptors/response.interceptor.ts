import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseService } from '../classes/response.common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        return next.handle().pipe(
            map(data => {
                const statusCode = context.switchToHttp().getResponse().statusCode;
                const message = data.message || 'Success';
                const responseData = data.data || data;

                return new ResponseService().success({ statusCode: statusCode, message: message, data: responseData, url: context.switchToHttp().getRequest().url })
            }),
        );
    }
}
