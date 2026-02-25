import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RoomModule } from './room/room.module';
import { ZoneModule } from './zone/zone.module';
import { RackModule } from './rack/rack.module';
import { ShelfModule } from './shelf/shelf.module';
import { MedicineSnapshotModule } from './medicinesnapshot/medicinesnapshot.module';
import { StockModule } from './stock/stock.module';
import { getTypeOrmConfig } from './common/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    RoomModule,
    ZoneModule,
    RackModule,
    ShelfModule,
    MedicineSnapshotModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
