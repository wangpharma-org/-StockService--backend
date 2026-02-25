import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  SHELF_REPOSITORY,
  type IShelfRepository,
} from '../domain/ports/shelf.repository.interface';
import { Shelf } from '../domain/shelf.entity';
import { CreateShelfDto } from '../presentation/dto/create-shelf.dto';
import { UpdateShelfDto } from '../presentation/dto/update-shelf.dto';
import { FindShelvesQueryDto } from '../presentation/dto/find-shelves-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { FindOptionsWhere } from 'typeorm';
import { MedicineSnapshotService } from '../../medicinesnapshot/application/medicinesnapshot.service';

@Injectable()
export class ShelfService {
  constructor(
    @Inject(SHELF_REPOSITORY)
    private readonly shelfRepository: IShelfRepository,
    private readonly medicineSnapshotService: MedicineSnapshotService,
  ) {}

  async create(dto: CreateShelfDto): Promise<Shelf> {
    const shelf = this.shelfRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      rackId: dto.rackId,
      medicineSnapshotId: dto.medicineSnapshotId ?? null,
      capacity: dto.capacity ?? null,
      quantity: dto.quantity ?? 0,
    });

    return this.shelfRepository.save(shelf);
  }

  async findAll(query: FindShelvesQueryDto) {
    const { page, limit, ...filters } = query;

    const [data, total] = await this.shelfRepository.findWithPagination(
      filters,
      page,
      limit,
    );

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string): Promise<Shelf> {
    const shelf = await this.shelfRepository.findById(id);

    if (!shelf) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { id: 'shelfNotFound' },
      });
    }

    return shelf;
  }

  async update(id: string, dto: UpdateShelfDto): Promise<Shelf> {
    const shelf = await this.findById(id);

    if (dto.name !== undefined) shelf.name = dto.name;
    if (dto.description !== undefined)
      shelf.description = dto.description ?? null;
    if (dto.rackId !== undefined) shelf.rackId = dto.rackId;
    if (dto.medicineSnapshotId !== undefined)
      shelf.medicineSnapshotId = dto.medicineSnapshotId ?? null;
    if (dto.capacity !== undefined) shelf.capacity = dto.capacity ?? null;
    if (dto.quantity !== undefined) shelf.quantity = dto.quantity;

    return this.shelfRepository.save(shelf);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.shelfRepository.softDelete(id);
  }

  async createDefaultShelfForNewProduct(dto: {
    medicineId: string;
    medicineCode: string;
    roomId: string;
    medicineName_en?: string;
    medicineName_th?: string;
  }): Promise<Shelf> {
    await this.medicineSnapshotService.create({
      id: dto.medicineId,
      medicineCode: dto.medicineCode,
      medicineName_en: dto.medicineName_en,
      medicineName_th: dto.medicineName_th,
    });

    const available = await this.shelfRepository.findAvailableInRoom(
      dto.roomId,
    );

    if (available) {
      available.medicineSnapshotId = dto.medicineId;
      return this.shelfRepository.save(available);
    }

    const rackId = await this.shelfRepository.findAnyRackIdInRoom(dto.roomId);

    if (!rackId) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { roomId: 'noRackFoundInRoom' },
      });
    }

    const shelf = this.shelfRepository.create({
      name: `Medicine ${dto.medicineCode}`,
      description: null,
      rackId,
      medicineSnapshotId: dto.medicineId,
      capacity: null,
      quantity: 0,
    });

    return this.shelfRepository.save(shelf);
  }
}
