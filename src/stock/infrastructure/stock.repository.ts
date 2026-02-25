import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStockRepository } from '../domain/ports/stock.repository.interface';
import { Shelf } from '../../shelf/domain/shelf.entity';
import { Rack } from '../../rack/domain/rack.entity';
import { Zone } from '../../zone/domain/zone.entity';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(
    @InjectRepository(Shelf)
    private readonly shelfRepository: Repository<Shelf>,
  ) {}

  async sumQuantityByMedicineInRoom(
    medicineId: string,
    roomId: string,
  ): Promise<number> {
    const result = await this.shelfRepository
      .createQueryBuilder('shelf')
      .select('COALESCE(SUM(shelf.quantity), 0)', 'total')
      .innerJoin(
        Rack,
        'rack',
        'rack.id = shelf.rack_id AND rack.deleted_at IS NULL',
      )
      .innerJoin(
        Zone,
        'zone',
        'zone.id = rack.zone_id AND zone.deleted_at IS NULL',
      )
      .where('shelf.medicineCode = :medicineCode', { medicineCode: medicineId })
      .andWhere('zone.room_id = :roomId', { roomId })
      .andWhere('shelf.deleted_at IS NULL')
      .getRawOne<{ total: string }>();

    return Number(result?.total ?? 0);
  }
}
