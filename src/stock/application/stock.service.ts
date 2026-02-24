import { Inject, Injectable } from '@nestjs/common';
import {
  STOCK_REPOSITORY,
  type IStockRepository,
} from '../domain/ports/stock.repository.interface';
import {
  CheckStockDto,
  StockCheckItemResultDto,
  StockCheckResultDto,
} from '../presentation/dto/check-stock.dto';

@Injectable()
export class StockService {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
  ) {}

  async checkStock(dto: CheckStockDto): Promise<StockCheckResultDto> {
    const results: StockCheckItemResultDto[] = await Promise.all(
      dto.items.map(async (item) => {
        const availableQuantity = await this.stockRepository.sumQuantityByMedicineInRoom(
          item.medicineCode,
          dto.roomId,
        );

        return {
          medicineCode: item.medicineCode,
          requiredQuantity: item.requiredQuantity,
          availableQuantity,
          sufficient: availableQuantity >= item.requiredQuantity,
        };
      }),
    );

    return {
      roomId: dto.roomId,
      allSufficient: results.every((r) => r.sufficient),
      items: results,
    };
  }
}

