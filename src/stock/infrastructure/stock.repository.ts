import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { IStockRepository } from '../domain/ports/stock.repository.interface';
import { Shelf } from '../../shelf/domain/shelf.entity';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(
    @InjectRepository(Shelf)
    private readonly shelfRepository: Repository<Shelf>,
  ) {}

  async sumQuantityByMedicineInRoom(
    medicineCode: string,
    roomId: string,
  ): Promise<number> {
    const shelves = await this.shelfRepository.find({
      relations: {
        rack: {
          zone: true,
        },
        medicineSnapshot: true,
      },
      where: {
        medicineSnapshot: {
          medicineCode: medicineCode,
        },
        rack: {
          zone: {
            roomId: roomId,
          },
          deletedAt: IsNull(),
        },
        deletedAt: IsNull(),
      },
    });

    return shelves.reduce((sum, shelf) => sum + (shelf.quantity || 0), 0);
  }
}
