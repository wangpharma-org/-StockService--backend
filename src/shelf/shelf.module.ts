import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shelf } from './domain/shelf.entity';
import { ShelfController } from './presentation/shelf.controller';
import { ShelfEventsConsumer } from './presentation/shelf-events.consumer';
import { ShelfService } from './application/shelf.service';
import { ShelfRepository } from './infrastructure/shelf.repository';
import { SHELF_REPOSITORY } from './domain/ports/shelf.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Shelf])],
  controllers: [ShelfController, ShelfEventsConsumer],
  providers: [
    ShelfService,
    { provide: SHELF_REPOSITORY, useClass: ShelfRepository },
  ],
  exports: [ShelfService],
})
export class ShelfModule {}
