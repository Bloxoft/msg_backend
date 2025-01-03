import { Module } from "@nestjs/common";
import { MicroserviceService } from "./services.service";
import { ServicesController } from "./services.controller";
import { MongoModels } from "../shared/mongo-models.module";
import { MessagingService } from "../messaging/messaging.service";
import { UserService } from "../user/user.service";
import { Microservices } from "../shared/microservice.module";

@Module({
    imports: [MongoModels, Microservices],
    controllers: [ServicesController],
    providers: [MessagingService, UserService, MicroserviceService],
})
export class ServicesModule { }