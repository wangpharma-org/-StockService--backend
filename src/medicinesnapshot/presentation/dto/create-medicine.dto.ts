
export interface CreateMedicineSnapshotDto {
  id: string;
  medicineCode: string;
  medicineName_en?: string;
  medicineName_th?: string;
}

export interface MedicineCreatedEventDto {
  medicineId: string;
  roomId: string;
  info: {
    medicineCode: string;
    medicineName_en?: string;
    medicineName_th?: string;
  };
}