import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ZONE_REPOSITORY,
  type IZoneRepository,
} from '../domain/ports/zone.repository.interface';
import { Zone } from '../domain/zone.entity';
import { CreateZoneDto } from '../presentation/dto/create-zone.dto';
import { UpdateZoneDto } from '../presentation/dto/update-zone.dto';
import { FindZonesQueryDto } from '../presentation/dto/find-zones-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class ZoneService {
  constructor(
    @Inject(ZONE_REPOSITORY)
    private readonly zoneRepository: IZoneRepository,
  ) {}

  async create(dto: CreateZoneDto): Promise<Zone> {
    const zone = this.zoneRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      roomId: dto.roomId,
    });

    return this.zoneRepository.save(zone);
  }

  async findAll(
    query: FindZonesQueryDto,
  ): Promise<{ data: Zone[]; meta: PaginationMeta }> {
    const { page, limit, name, roomId } = query;
    const { skip, take } = buildPaginationOptions(page, limit);

    const where: FindOptionsWhere<Zone> = {};
    if (name) where.name = name;
    if (roomId) where.roomId = roomId;

    const [data, total] = await this.zoneRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string): Promise<Zone> {
    const zone = await this.zoneRepository.findById(id);

    if (!zone) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { id: 'zoneNotFound' },
      });
    }

    return zone;
  }

  async update(id: string, dto: UpdateZoneDto): Promise<Zone> {
    const zone = await this.findById(id);

    if (dto.name !== undefined) zone.name = dto.name;
    if (dto.description !== undefined)
      zone.description = dto.description ?? null;
    if (dto.roomId !== undefined) zone.roomId = dto.roomId;

    return this.zoneRepository.save(zone);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.zoneRepository.softDelete(id);
  }
}
