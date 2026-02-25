import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices/decorators/event-pattern.decorator';
import { Payload } from '@nestjs/microservices';
import { MedicineSnapshotService } from '../application/medicinesnapshot.service';
import type { MedicineUpdatedEventDto } from './dto/update-medicine.dto';

@Controller()
export class MedicineSnapshotEventsConsumer {
  private readonly logger = new Logger(MedicineSnapshotEventsConsumer.name);

  constructor(
    private readonly medicineSnapshotService: MedicineSnapshotService,
  ) {}

  @EventPattern('medicine.updated.v1')
  async handleMedicineUpdated(@Payload() message: MedicineUpdatedEventDto) {
    const { medicineId, info } = message;

    await this.medicineSnapshotService.update({
      id: medicineId,
      medicineCode: info.medicineCode,
      medicineName_en: info.medicineName_en,
      medicineName_th: info.medicineName_th,
    });
  }
}
