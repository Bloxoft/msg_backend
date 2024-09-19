import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
