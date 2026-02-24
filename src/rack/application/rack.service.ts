import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RACK_REPOSITORY,
  type IRackRepository,
} from '../domain/ports/rack.repository.interface';
import { Rack } from '../domain/rack.entity';
import { CreateRackDto } from '../presentation/dto/create-rack.dto';
import { UpdateRackDto } from '../presentation/dto/update-rack.dto';
import { FindRacksQueryDto } from '../presentation/dto/find-racks-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class RackService {
  constructor(
    @Inject(RACK_REPOSITORY)
    private readonly rackRepository: IRackRepository,
  ) {}

  async create(dto: CreateRackDto): Promise<Rack> {
    const rack = this.rackRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      zoneId: dto.zoneId,
    });

    return this.rackRepository.save(rack);
  }

  async findAll(
    query: FindRacksQueryDto,
  ): Promise<{ data: Rack[]; meta: PaginationMeta }> {
    const { page, limit, name, zoneId } = query;
    const { skip, take } = buildPaginationOptions(page, limit);

    const where: FindOptionsWhere<Rack> = {};
    if (name) where.name = name;
    if (zoneId) where.zoneId = zoneId;

    const [data, total] = await this.rackRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string): Promise<Rack> {
    const rack = await this.rackRepository.findById(id);

    if (!rack) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { id: 'rackNotFound' },
      });
    }

    return rack;
  }

  async update(id: string, dto: UpdateRackDto): Promise<Rack> {
    const rack = await this.findById(id);

    if (dto.name !== undefined) rack.name = dto.name;
    if (dto.description !== undefined) rack.description = dto.description ?? null;
    if (dto.zoneId !== undefined) rack.zoneId = dto.zoneId;

    return this.rackRepository.save(rack);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.rackRepository.softDelete(id);
  }
}
