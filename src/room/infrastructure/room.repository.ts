import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Room } from '../domain/room.entity';
import { IRoomRepository } from '../domain/ports/room.repository.interface';

@Injectable()
export class RoomRepository implements IRoomRepository {
  constructor(
    @InjectRepository(Room)
    private readonly repository: Repository<Room>,
  ) {}

  findById(id: string): Promise<Room | null> {
    return this.repository.findOneBy({ id });
  }

  findAndCount(options: FindManyOptions<Room>): Promise<[Room[], number]> {
    return this.repository.findAndCount(options);
  }

  create(data: Partial<Room>): Room {
    return this.repository.create(data);
  }

  save(room: Room): Promise<Room> {
    return this.repository.save(room);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
