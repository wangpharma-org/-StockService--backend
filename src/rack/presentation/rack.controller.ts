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
import { RackService } from '../application/rack.service';
import { CreateRackDto } from './dto/create-rack.dto';
import { UpdateRackDto } from './dto/update-rack.dto';
import { FindRacksQueryDto } from './dto/find-racks-query.dto';
import { Rack } from '../domain/rack.entity';
import { PaginationMeta } from '../../common/utils/pagination.util';

@ApiTags('racks')
@Controller('racks')
export class RackController {
  constructor(private readonly rackService: RackService) {}

  @ApiOperation({ summary: 'Create a new rack' })
  @Post()
  create(@Body() dto: CreateRackDto): Promise<Rack> {
    return this.rackService.create(dto);
  }

  @ApiOperation({ summary: 'List racks with pagination and filters' })
  @Get()
  findAll(
    @Query() query: FindRacksQueryDto,
  ): Promise<{ data: Rack[]; meta: PaginationMeta }> {
    return this.rackService.findAll(query);
  }

  @ApiOperation({ summary: 'Get rack by ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Rack> {
    return this.rackService.findById(id);
  }

  @ApiOperation({ summary: 'Update rack' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRackDto): Promise<Rack> {
    return this.rackService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete (soft-delete) rack' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.rackService.remove(id);
  }
}
