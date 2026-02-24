import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Repository } from 'typeorm';
import { Shelf } from '../domain/shelf.entity';
import { IShelfRepository } from '../domain/ports/shelf.repository.interface';
import { Rack } from '../../rack/domain/rack.entity';
import { Zone } from '../../zone/domain/zone.entity';

@Injectable()
export class ShelfRepository implements IShelfRepository {
  constructor(
    @InjectRepository(Shelf)
    private readonly repository: Repository<Shelf>,
  ) {}

  findById(id: string): Promise<Shelf | null> {
    return this.repository.findOneBy({ id });
  }

  findAndCount(options: FindManyOptions<Shelf>): Promise<[Shelf[], number]> {
    return this.repository.findAndCount(options);
  }

  async findAvailableInRoom(roomId: string): Promise<Shelf | null> {
    return this.repository.findOne({
        where: {
        medicineCode: IsNull(),
        deletedAt: IsNull(),
        rack: {
            deletedAt: IsNull(),
            zone: {
            deletedAt: IsNull(),
            room: {
                id: roomId,
            },
            },
        },
        },
        relations: {
        rack: {
            zone: {
            room: true,
            },
        },
        },
    });
    }

  async findAnyRackIdInRoom(roomId: string): Promise<string | null> {
    const shelf = await this.repository.findOne({
        select: {
        rack: {
            id: true,
        },
        },
        where: {
        deletedAt: IsNull(),
        rack: {
            deletedAt: IsNull(),
            zone: {
            deletedAt: IsNull(),
            room: {
                id: roomId,
            },
            },
        },
        },
        relations: {
        rack: {
            zone: {
            room: true,
            },
        },
        },
    });

    return shelf?.rack?.id ?? null;
    }

  create(data: Partial<Shelf>): Shelf {
    return this.repository.create(data);
  }

  save(shelf: Shelf): Promise<Shelf> {
    return this.repository.save(shelf);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
