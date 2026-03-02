import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './domain/room.entity';
import { RoomController } from './presentation/room.controller';
import { RoomService } from './application/room.service';
import { RoomRepository } from './infrastructure/room.repository';
import { ROOM_REPOSITORY } from './domain/ports/room.repository.interface';
import { ZoneModule } from '../zone/zone.module';
import { RackModule } from '../rack/rack.module';
import { ShelfModule } from '../shelf/shelf.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    ZoneModule,
    RackModule,
    ShelfModule,
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
  controllers: [RoomController],
  providers: [
    RoomService,
    { provide: ROOM_REPOSITORY, useClass: RoomRepository },
  ],
  exports: [RoomService],
})
export class RoomModule {}
