import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { StockService } from '../application/stock.service';

@Controller()
export class StockEventsConsumer {
  constructor(
    private readonly stockService: StockService,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  @EventPattern('prescription.created.v1')
  async checkStockWhenPrescriptionCreated(@Payload() message: any) {
    const { prescriptionId, roomId, items } = message;
    
    const result = await this.stockService.checkStock({
      prescriptionId,
      roomId,
      items,
    });

    await this.kafkaClient.emit('stock.reserved.v1', {
      prescriptionId,
      reserveStatus: result.allSufficient ? 'RESERVED' : 'FAILED',
    });

  }
}
