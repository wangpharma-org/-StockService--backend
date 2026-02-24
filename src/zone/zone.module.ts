import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './domain/zone.entity';
import { ZoneController } from './presentation/zone.controller';
import { ZoneService } from './application/zone.service';
import { ZoneRepository } from './infrastructure/zone.repository';
import { ZONE_REPOSITORY } from './domain/ports/zone.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Zone])],
  controllers: [ZoneController],
  providers: [
    ZoneService,
    { provide: ZONE_REPOSITORY, useClass: ZoneRepository },
  ],
  exports: [ZoneService],
})
export class ZoneModule {}
