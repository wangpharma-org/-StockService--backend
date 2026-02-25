import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  MEDICINE_SNAPSHOT_REPOSITORY,
  type IMedicineSnapshotRepository,
} from '../domain/ports/medicinesnapshot.repository.interface';
import { MedicineSnapshot } from '../domain/medicinesnapshot.entity';

export interface CreateMedicineSnapshotDto {
  medicineCode: string;
  medicineName_en?: string;
  medicineName_th?: string;
}

export interface UpdateMedicineSnapshotDto {
  medicineName_en?: string;
  medicineName_th?: string;
}

@Injectable()
export class MedicineSnapshotService {
  private readonly logger = new Logger(MedicineSnapshotService.name);

  constructor(
    @Inject(MEDICINE_SNAPSHOT_REPOSITORY)
    private readonly medicineSnapshotRepository: IMedicineSnapshotRepository,
  ) {}

  async createOrUpdate(
    dto: CreateMedicineSnapshotDto,
  ): Promise<MedicineSnapshot> {
    const existing = await this.medicineSnapshotRepository.findByMedicineCode(
      dto.medicineCode,
    );

    if (existing) {
      this.logger.log(
        `Updating existing MedicineSnapshot for code: ${dto.medicineCode}`,
      );
      return this.medicineSnapshotRepository.update(dto.medicineCode, {
        medicineName_en: dto.medicineName_en ?? null,
        medicineName_th: dto.medicineName_th ?? null,
      });
    }

    this.logger.log(
      `Creating new MedicineSnapshot for code: ${dto.medicineCode}`,
    );
    const medicineSnapshot = this.medicineSnapshotRepository.create({
      medicineCode: dto.medicineCode,
      medicineName_en: dto.medicineName_en ?? null,
      medicineName_th: dto.medicineName_th ?? null,
    });

    return this.medicineSnapshotRepository.save(medicineSnapshot);
  }

  async findByMedicineCode(
    medicineCode: string,
  ): Promise<MedicineSnapshot | null> {
    return this.medicineSnapshotRepository.findByMedicineCode(medicineCode);
  }
}
