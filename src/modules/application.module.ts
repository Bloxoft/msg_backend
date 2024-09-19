import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UtilityModule } from './utility/utility.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Module({
    imports: [
        UserModule,
        AuthModule,
        UtilityModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ExceptionsFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor
        }
    ]
})
export class ApplicationModule { }
