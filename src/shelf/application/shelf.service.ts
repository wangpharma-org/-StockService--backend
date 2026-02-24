import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  SHELF_REPOSITORY,
  type IShelfRepository,
} from '../domain/ports/shelf.repository.interface';
import { Shelf } from '../domain/shelf.entity';
import { CreateDefaultShelfForNewProductDto, CreateShelfDto } from '../presentation/dto/create-shelf.dto';
import { UpdateShelfDto } from '../presentation/dto/update-shelf.dto';
import { FindShelvesQueryDto } from '../presentation/dto/find-shelves-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class ShelfService {
  constructor(
    @Inject(SHELF_REPOSITORY)
    private readonly shelfRepository: IShelfRepository,
  ) {}

  async create(dto: CreateShelfDto): Promise<Shelf> {
    const shelf = this.shelfRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      rackId: dto.rackId,
      medicineCode: dto.medicineCode ?? null,
      capacity: dto.capacity ?? null,
      quantity: dto.quantity ?? 0,
    });

    return this.shelfRepository.save(shelf);
  }

  async findAll(
    query: FindShelvesQueryDto,
  ): Promise<{ data: Shelf[]; meta: PaginationMeta }> {
    const { page, limit, name, rackId, medicineCode } = query;
    const { skip, take } = buildPaginationOptions(page, limit);

    const where: FindOptionsWhere<Shelf> = {};
    if (name) where.name = name;
    if (rackId) where.rackId = rackId;
    if (medicineCode) where.medicineCode = medicineCode;

    const [data, total] = await this.shelfRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data, meta: buildPaginationMeta(total, page, limit) };
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
    if (dto.description !== undefined) shelf.description = dto.description ?? null;
    if (dto.rackId !== undefined) shelf.rackId = dto.rackId;
    if (dto.medicineCode !== undefined) shelf.medicineCode = dto.medicineCode ?? null;
    if (dto.capacity !== undefined) shelf.capacity = dto.capacity ?? null;
    if (dto.quantity !== undefined) shelf.quantity = dto.quantity;

    return this.shelfRepository.save(shelf);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.shelfRepository.softDelete(id);
  }

  async createDefaultShelfForNewProduct(dto: CreateDefaultShelfForNewProductDto): Promise<Shelf> {
    const available = await this.shelfRepository.findAvailableInRoom(dto.roomId);

    if (available) {
      available.medicineCode = dto.medicineCode;
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
      medicineCode: dto.medicineCode,
      capacity: null,
      quantity: 0,
    });

    return this.shelfRepository.save(shelf);
  }


}
