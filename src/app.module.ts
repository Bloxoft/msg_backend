import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApplicationModule } from './modules/application.module';
import { UtilityModule } from './modules/utility/utility.module';

@Module({
  imports: [
    CacheModule.register(),
    EventEmitterModule.forRoot(),
    ApplicationModule,
    ClientsModule.register([
      {
        name: 'LANG_CHAIN_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 2001,
        },
      },
      {
        name: 'NOTIFIER_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 2002,
        },
      },
    ]),
    DatabaseModule,
    // UtilityModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule { }
