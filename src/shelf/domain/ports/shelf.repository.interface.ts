import { FindManyOptions } from 'typeorm';
import { Shelf } from '../shelf.entity';

export interface IShelfRepository {
  findById(id: string): Promise<Shelf | null>;
  findAndCount(options: FindManyOptions<Shelf>): Promise<[Shelf[], number]>;
  // Find a shelf with no medicine assigned inside the given room
  findAvailableInRoom(roomId: string): Promise<Shelf | null>;
  // Find any rackId that belongs to the given room (used when no available shelf exists)
  findAnyRackIdInRoom(roomId: string): Promise<string | null>;
  create(data: Partial<Shelf>): Shelf;
  save(shelf: Shelf): Promise<Shelf>;
  softDelete(id: string): Promise<void>;
}

export const SHELF_REPOSITORY = Symbol('IShelfRepository');
