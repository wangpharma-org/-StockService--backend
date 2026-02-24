import { Controller, Logger } from "@nestjs/common";
import { ShelfService } from "../application/shelf.service";
import { EventPattern } from "@nestjs/microservices/decorators/event-pattern.decorator";
import { CreateDefaultShelfForNewProductDto } from "./dto/create-shelf.dto";
import { Payload } from "@nestjs/microservices";

@Controller()
export class ShelfEventsConsumer {
    private readonly logger = new Logger(ShelfEventsConsumer.name);

    constructor(private readonly shelfService: ShelfService) {}

    @EventPattern('medicine.created.v1')
    async createDefaultShelfWhenMedicineCreated(@Payload() message: CreateDefaultShelfForNewProductDto) {
        const { medicineCode, roomId } = message;

        await this.shelfService.createDefaultShelfForNewProduct({
            medicineCode,
            roomId,
        });
    }
}