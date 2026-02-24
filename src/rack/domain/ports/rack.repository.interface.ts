import { FindManyOptions } from 'typeorm';
import { Rack } from '../rack.entity';

export interface IRackRepository {
  findById(id: string): Promise<Rack | null>;
  findAndCount(options: FindManyOptions<Rack>): Promise<[Rack[], number]>;
  create(data: Partial<Rack>): Rack;
  save(rack: Rack): Promise<Rack>;
  softDelete(id: string): Promise<void>;
}

export const RACK_REPOSITORY = Symbol('IRackRepository');
