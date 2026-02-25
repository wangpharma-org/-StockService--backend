import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices/decorators/event-pattern.decorator';
import { Payload } from '@nestjs/microservices';
import { MedicineSnapshotService } from '../application/medicinesnapshot.service';

export interface MedicineCreatedEventDto {
  medicineId: string;
  roomId: string;
  info: {
    medicineCode: string;
    medicineName_en?: string;
    medicineName_th?: string;
  };
}

export interface MedicineUpdatedEventDto {
  medicineId: string;
  info: {
    medicineCode: string;
    medicineName_en?: string;
    medicineName_th?: string;
  };
}

@Controller()
export class MedicineSnapshotEventsConsumer {
  private readonly logger = new Logger(MedicineSnapshotEventsConsumer.name);

  constructor(
    private readonly medicineSnapshotService: MedicineSnapshotService,
  ) {}

  @EventPattern('medicine.updated.v1')
  async handleMedicineUpdated(@Payload() message: MedicineUpdatedEventDto) {
    const { info } = message;

    await this.medicineSnapshotService.createOrUpdate({
      medicineCode: info.medicineCode,
      medicineName_en: info.medicineName_en,
      medicineName_th: info.medicineName_th,
    });
  }
}
