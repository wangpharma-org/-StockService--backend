import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shelf } from '../shelf/domain/shelf.entity';
import { StockController } from './presentation/stock.controller';
import { StockService } from './application/stock.service';
import { StockRepository } from './infrastructure/stock.repository';
import { STOCK_REPOSITORY } from './domain/ports/stock.repository.interface';
import { StockEventsConsumer } from './presentation/stock-event.consumer';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
@Module({
  // Stock has no own table — it queries Shelf data directly
  imports: [TypeOrmModule.forFeature([Shelf]),
    ClientsModule.register([
        {
            name: 'KAFKA_SERVICE',
            transport: Transport.KAFKA,
            options: {
            client: {
                clientId: 'medicine-service',
                brokers: ['localhost:9092'],
            },
            producerOnlyMode: true,
            },
        },
    ]),
 ],
  controllers: [StockController, StockEventsConsumer],
  providers: [
    StockService,
    { provide: STOCK_REPOSITORY, useClass: StockRepository },
  ],
  exports: [StockService],
})
export class StockModule {}

