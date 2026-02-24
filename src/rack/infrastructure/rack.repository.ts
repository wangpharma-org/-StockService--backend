import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Rack } from '../domain/rack.entity';
import { IRackRepository } from '../domain/ports/rack.repository.interface';

@Injectable()
export class RackRepository implements IRackRepository {
  constructor(
    @InjectRepository(Rack)
    private readonly repository: Repository<Rack>,
  ) {}

  findById(id: string): Promise<Rack | null> {
    return this.repository.findOneBy({ id });
  }

  findAndCount(options: FindManyOptions<Rack>): Promise<[Rack[], number]> {
    return this.repository.findAndCount(options);
  }

  create(data: Partial<Rack>): Rack {
    return this.repository.create(data);
  }

  save(rack: Rack): Promise<Rack> {
    return this.repository.save(rack);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
