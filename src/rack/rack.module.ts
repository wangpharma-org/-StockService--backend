import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rack } from './domain/rack.entity';
import { RackController } from './presentation/rack.controller';
import { RackService } from './application/rack.service';
import { RackRepository } from './infrastructure/rack.repository';
import { RACK_REPOSITORY } from './domain/ports/rack.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Rack])],
  controllers: [RackController],
  providers: [
    RackService,
    { provide: RACK_REPOSITORY, useClass: RackRepository },
  ],
  exports: [RackService],
})
export class RackModule {}
