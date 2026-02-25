import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { Shelf } from '../domain/shelf.entity';
import { IShelfRepository } from '../domain/ports/shelf.repository.interface';

@Injectable()
export class ShelfRepository implements IShelfRepository {
  constructor(
    @InjectRepository(Shelf)
    private readonly repository: Repository<Shelf>,
  ) {}

  findById(id: string): Promise<Shelf | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        medicineSnapshot: true,
        rack: {
          zone: {
            room: true,
          },
        },
      },
    });
  }

  async findWithPagination(
    filters: {
      name?: string;
      rackId?: string;
      medicineSnapshotId?: string;
    },
    page: number,
    limit: number,
  ): Promise<[Shelf[], number]> {

    const where: FindOptionsWhere<Shelf> = {};

    if (filters.name) {
      where.name = filters.name;
    }

    if (filters.rackId) {
      where.rackId = filters.rackId;
    }

    if (filters.medicineSnapshotId) {
      where.medicineSnapshotId = filters.medicineSnapshotId;
    }

    return this.repository.findAndCount({
      where,
      relations: {
        medicineSnapshot: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findAvailableInRoom(roomId: string): Promise<Shelf | null> {
    return this.repository.findOne({
      where: {
        deletedAt: IsNull(),
        medicineSnapshotId: IsNull(), // Find shelf with no medicine assigned
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
        medicineSnapshot: true,
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
