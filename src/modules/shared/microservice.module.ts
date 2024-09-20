import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_PORTS } from "src/config/env.config";

const modules = [
    ClientsModule.register([
        {
            name: 'LANG_CHAIN_SERVICE',
            transport: Transport.TCP,
            options: {
                port: MICROSERVICE_PORTS.AI,
            },
        },
        {
            name: 'NOTIFIER_SERVICE',
            transport: Transport.TCP,
            options: {
                port: MICROSERVICE_PORTS.NOTIFIER,
            },
        },
    ]),
]

@Module({
    imports: modules,
    exports: modules,
})
export class Microservices { }