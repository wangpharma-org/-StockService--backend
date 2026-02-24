import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZoneService } from '../application/zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { FindZonesQueryDto } from './dto/find-zones-query.dto';
import { Zone } from '../domain/zone.entity';
import { PaginationMeta } from '../../common/utils/pagination.util';

@ApiTags('zones')
@Controller('zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @ApiOperation({ summary: 'Create a new zone' })
  @Post()
  create(@Body() dto: CreateZoneDto): Promise<Zone> {
    return this.zoneService.create(dto);
  }

  @ApiOperation({ summary: 'List zones with pagination and filters' })
  @Get()
  findAll(
    @Query() query: FindZonesQueryDto,
  ): Promise<{ data: Zone[]; meta: PaginationMeta }> {
    return this.zoneService.findAll(query);
  }

  @ApiOperation({ summary: 'Get zone by ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Zone> {
    return this.zoneService.findById(id);
  }

  @ApiOperation({ summary: 'Update zone' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateZoneDto,
  ): Promise<Zone> {
    return this.zoneService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete (soft-delete) zone' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.zoneService.remove(id);
  }
}
