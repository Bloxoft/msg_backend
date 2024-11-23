import { Module } from "@nestjs/common";
import { MicroserviceService } from "./services.service";
import { ServicesController } from "./services.controller";
import { MongoModels } from "../shared/mongo-models.module";
import { MessagingService } from "../messaging/messaging.service";
import { UserService } from "../user/user.service";

@Module({
    imports: [MongoModels],
    controllers: [ServicesController],
    providers: [MicroserviceService, MessagingService, UserService],
})
export class ServicesModule { }