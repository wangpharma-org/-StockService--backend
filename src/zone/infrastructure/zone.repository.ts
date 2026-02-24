import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Zone } from '../domain/zone.entity';
import { IZoneRepository } from '../domain/ports/zone.repository.interface';

@Injectable()
export class ZoneRepository implements IZoneRepository {
  constructor(
    @InjectRepository(Zone)
    private readonly repository: Repository<Zone>,
  ) {}

  findById(id: string): Promise<Zone | null> {
    return this.repository.findOneBy({ id });
  }

  findAndCount(options: FindManyOptions<Zone>): Promise<[Zone[], number]> {
    return this.repository.findAndCount(options);
  }

  create(data: Partial<Zone>): Zone {
    return this.repository.create(data);
  }

  save(zone: Zone): Promise<Zone> {
    return this.repository.save(zone);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
