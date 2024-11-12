// Import necessary modules or dependencies

import { EventPattern, Payload } from "@nestjs/microservices";
import { MicroserviceService } from "./services.service";
import { logger } from "src/utils/logger.lib";
import { Controller } from "@nestjs/common";

// Define a class or function to be part of the module
@Controller()
export class ServicesController {
    constructor(private readonly mainService: MicroserviceService) { }


    @EventPattern('test-service')
    handleTestServiceEvent(@Payload() data: any) {
        logger.log(data)
    }
}