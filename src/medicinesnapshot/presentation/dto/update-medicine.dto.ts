import { MedicineInfoDto } from "src/shelf/presentation/dto/create-shelf.dto";

export class UpdateMedicineDto {
    medicineId: string;
    info: MedicineInfoDto;
}