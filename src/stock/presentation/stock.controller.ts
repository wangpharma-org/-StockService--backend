import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StockService } from '../application/stock.service';
import { CheckStockDto, StockCheckResultDto } from './dto/check-stock.dto';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiOperation({
    summary: 'Check if prescription items have sufficient stock in a room',
  })
  @Post('check')
  checkStock(@Body() dto: CheckStockDto): Promise<StockCheckResultDto> {
    return this.stockService.checkStock(dto);
  }
}
