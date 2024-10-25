import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UtilityModule } from './utility/utility.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthenticationModule } from './authentication/authentication.module';
import { OtpModule } from './otp/otp.module';
import { ProcessModule } from './processes/process.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { UserService } from './user/user.service';
import { MongoModels } from './shared/mongo-models.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        UserModule,
        UtilityModule,
        AuthenticationModule,
        OtpModule,
        ProcessModule,
        MongoModels,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ExceptionsFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor
        },
        UserService,
        JwtService
    ]
})
export class ApplicationModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({
            path: '*',
            method: RequestMethod.ALL
        })
    }
}
