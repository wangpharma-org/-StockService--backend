export interface UpdateMedicineSnapshotDto {
  id: string;
  medicineCode?: string;
  medicineName_en?: string;
  medicineName_th?: string;
}

export interface MedicineUpdatedEventDto {
  medicineId: string;
  info: {
    medicineCode: string;
    medicineName_en?: string;
    medicineName_th?: string;
  };
}
