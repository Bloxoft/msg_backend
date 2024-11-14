// Import necessary modules or dependencies

import { Ctx, EventPattern, MessagePattern, Payload, RedisContext } from "@nestjs/microservices";
import { MicroserviceService } from "./services.service";
import { Controller } from "@nestjs/common";
import { logger } from "src/common/helpers/logger.lib";

// Define a class or function to be part of the module
export enum SubPattern {
    CREATE_MESSAGE = 'create-message'
}

@Controller()
export class ServicesController {
    constructor(private readonly mainService: MicroserviceService) { }

    // messaging patterns
    @MessagePattern({ cmd: SubPattern.CREATE_MESSAGE })
    async onCreateMessageForChat(data: number[]): Promise<number> {
        console.log('it hits')
        return (data || []).reduce((a, b) => a + b);
    }

}