import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ROOM_REPOSITORY,
  type IRoomRepository,
} from '../domain/ports/room.repository.interface';
import { Room } from '../domain/room.entity';
import { CreateRoomDto } from '../presentation/dto/create-room.dto';
import { UpdateRoomDto } from '../presentation/dto/update-room.dto';
import { FindRoomsQueryDto } from '../presentation/dto/find-rooms-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { FindOptionsWhere } from 'typeorm';
import { ZoneService } from '../../zone/application/zone.service';
import { RackService } from '../../rack/application/rack.service';
import { ShelfService } from '../../shelf/application/shelf.service';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
    private readonly zoneService: ZoneService,
    private readonly rackService: RackService,
    private readonly shelfService: ShelfService,
  ) {}

  async create(dto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create({
      name: dto.name,
      description: dto.description ?? null,
    });

    const savedRoom = await this.roomRepository.save(room);

    // Create default Zone → Rack → Shelf for every new room
    await this.createDefaults(savedRoom);

    return savedRoom;
  }

  private async createDefaults(room: Room): Promise<void> {
    try {
      const zone = await this.zoneService.create({
        name: `${room.name} - Default Zone`,
        description: 'Default zone',
        roomId: room.id,
      });

      const rack = await this.rackService.create({
        name: `${room.name} - Default Rack`,
        description: 'Default rack',
        zoneId: zone.id,
      });

      await this.shelfService.create({
        name: `${room.name} - Default Shelf`,
        description: 'Default shelf',
        rackId: rack.id,
        capacity: 50,
        quantity: 0,
      });
    } catch (err) {
      this.logger.error(
        `Failed to create defaults for room "${room.name}": ${(err as Error).message}`,
      );

      throw err;
    }
  }

  async findAll(
    query: FindRoomsQueryDto,
  ): Promise<{ data: Room[]; meta: PaginationMeta }> {
    const { page, limit, name } = query;
    const { skip, take } = buildPaginationOptions(page, limit);

    const where: FindOptionsWhere<Room> = {};
    if (name) where.name = name;

    const [data, total] = await this.roomRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string): Promise<Room> {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { id: 'roomNotFound' },
      });
    }

    return room;
  }

  async update(id: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.findById(id);

    if (dto.name !== undefined) room.name = dto.name;
    if (dto.description !== undefined) room.description = dto.description ?? null;

    return this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.roomRepository.softDelete(id);
  }
}
