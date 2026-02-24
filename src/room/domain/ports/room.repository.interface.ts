import { FindManyOptions } from 'typeorm';
import { Room } from '../room.entity';

export interface IRoomRepository {
  findById(id: string): Promise<Room | null>;
  findAndCount(options: FindManyOptions<Room>): Promise<[Room[], number]>;
  create(data: Partial<Room>): Room;
  save(room: Room): Promise<Room>;
  softDelete(id: string): Promise<void>;
}

export const ROOM_REPOSITORY = Symbol('IRoomRepository');
