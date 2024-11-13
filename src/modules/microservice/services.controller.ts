// Import necessary modules or dependencies

import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { MicroserviceService } from "./services.service";
import { Controller } from "@nestjs/common";
import { logger } from "src/common/helpers/logger.lib";

// Define a class or function to be part of the module
@Controller()
export class ServicesController {
    constructor(private readonly mainService: MicroserviceService) { }


    @MessagePattern({ cmd: 'testServer' })
    handleTestServiceEvent(@Payload() data: any): string {
        logger.log(data)
        return 'hello there'
    }
}