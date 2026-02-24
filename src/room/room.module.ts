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

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    ZoneModule,
    RackModule,
    ShelfModule,
  ],
  controllers: [RoomController],
  providers: [
    RoomService,
    { provide: ROOM_REPOSITORY, useClass: RoomRepository },
  ],
  exports: [RoomService],
})
export class RoomModule {}
