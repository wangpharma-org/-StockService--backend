import { Controller, Logger } from '@nestjs/common';
import { ShelfService } from '../application/shelf.service';
import { EventPattern } from '@nestjs/microservices/decorators/event-pattern.decorator';
import { CreateDefaultShelfForNewProductDto } from './dto/create-shelf.dto';
import { Payload } from '@nestjs/microservices';

@Controller()
export class ShelfEventsConsumer {
  constructor(private readonly shelfService: ShelfService) {}

  @EventPattern('medicine.created.v1')
  async createDefaultShelfWhenMedicineCreated(
    @Payload() message: CreateDefaultShelfForNewProductDto,
  ) {
    const { medicineId, roomId, info } = message;

    try{ 
      await this.shelfService.createDefaultShelfForNewProduct({
        medicineId: medicineId,
        roomId,
        medicineCode: info.medicineCode,
        medicineName_en: info.medicineName_en,
        medicineName_th: info.medicineName_th,
    });
    } catch (error) {
        Logger.error(`Failed to create default shelf for medicine code: ${info.medicineCode} in room: ${roomId}. Error: ${error.message}`); 
    }
    
  }
}
