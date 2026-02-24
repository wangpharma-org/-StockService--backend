import { FindManyOptions } from 'typeorm';
import { Zone } from '../zone.entity';

export interface IZoneRepository {
  findById(id: string): Promise<Zone | null>;
  findAndCount(options: FindManyOptions<Zone>): Promise<[Zone[], number]>;
  create(data: Partial<Zone>): Zone;
  save(zone: Zone): Promise<Zone>;
  softDelete(id: string): Promise<void>;
}

export const ZONE_REPOSITORY = Symbol('IZoneRepository');
