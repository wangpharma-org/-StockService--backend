import { MedicineSnapshot } from '../medicinesnapshot.entity';

export interface IMedicineSnapshotRepository {
  findByMedicineCode(medicineCode: string): Promise<MedicineSnapshot | null>;
  create(data: Partial<MedicineSnapshot>): MedicineSnapshot;
  save(medicineSnapshot: MedicineSnapshot): Promise<MedicineSnapshot>;
  update(
    medicineCode: string,
    data: Partial<MedicineSnapshot>,
  ): Promise<MedicineSnapshot>;
}

export const MEDICINE_SNAPSHOT_REPOSITORY = Symbol(
  'IMedicineSnapshotRepository',
);
