import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UtilityModule } from './utility/utility.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthenticationModule } from './authentication/authentication.module';
import { OtpModule } from './otp/otp.module';

@Module({
    imports: [
        UserModule,
        UtilityModule,
        AuthenticationModule,
        OtpModule,
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
