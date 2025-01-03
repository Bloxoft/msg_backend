// Import necessary modules or dependencies

import { Ctx, EventPattern, MessagePattern, Payload, RedisContext } from "@nestjs/microservices";
import { MicroserviceService } from "./services.service";
import { Controller } from "@nestjs/common";
import { logger } from "src/common/helpers/logger.lib";
import { CreateMessageDto } from "../messaging/dto/create-message.dto";
import { Message } from "../messaging/models/message.model";
import { MessagingService } from "../messaging/messaging.service";
import { _ } from "src/constant/variables.static";
import { MicroserviceResponseType } from "./classes/response.type";
import { cleanObject } from "src/utils/helpers";

// Define a class or function to be part of the module
export enum SubPattern {
    TEST_SERVER = 'test-server',
    CREATE_MESSAGE = 'create-message'
}
// responseType: { success: boolean, message: string, data: any }

@Controller()
export class ServicesController {
    constructor(
        private readonly mainService: MicroserviceService,
        private readonly messagingService: MessagingService
    ) { }


    // messaging patterns

    @MessagePattern({ cmd: SubPattern.TEST_SERVER })
    async onTestServer(): Promise<boolean> {
        return true;
    }

    @MessagePattern({ cmd: SubPattern.CREATE_MESSAGE })
    async onCreateMessageForChat(@Payload() payload: { userId: string, data: CreateMessageDto }): Promise<MicroserviceResponseType> {
        try {
            const sanitized: CreateMessageDto = cleanObject(payload.data);
            const createMessage = await this.messagingService.createMessage(sanitized.messageData, payload.userId);
            return new MicroserviceResponseType(true, createMessage.message, {
                sendFrom: sanitized.senderDeviceId,
                messageData: createMessage.data
            });
        } catch (error) {
            return new MicroserviceResponseType(false, error.message, error)
        }
    }

}