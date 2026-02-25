import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineSnapshot } from './domain/medicinesnapshot.entity';
import { MedicineSnapshotService } from './application/medicinesnapshot.service';
import { MedicineSnapshotRepository } from './infrastructure/medicinesnapshot.repository';
import { MedicineSnapshotEventsConsumer } from './presentation/medicinesnapshot-events.consumer';
import { MEDICINE_SNAPSHOT_REPOSITORY } from './domain/ports/medicinesnapshot.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([MedicineSnapshot])],
  controllers: [MedicineSnapshotEventsConsumer],
  providers: [
    MedicineSnapshotService,
    {
      provide: MEDICINE_SNAPSHOT_REPOSITORY,
      useClass: MedicineSnapshotRepository,
    },
  ],
  exports: [MedicineSnapshotService],
})
export class MedicineSnapshotModule {}
