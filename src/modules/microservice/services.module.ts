import { Module } from "@nestjs/common";
import { MicroserviceService } from "./services.service";
import { ServicesController } from "./services.controller";

@Module({
    imports: [],
    controllers: [ServicesController],
    providers: [MicroserviceService],
})
export class ServicesModule { }