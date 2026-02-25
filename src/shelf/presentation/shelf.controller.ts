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
import { ShelfService } from '../application/shelf.service';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';
import { FindShelvesQueryDto } from './dto/find-shelves-query.dto';
import { Shelf } from '../domain/shelf.entity';
import { PaginationMeta } from '../../common/utils/pagination.util';

@ApiTags('shelves')
@Controller('shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @ApiOperation({ summary: 'Create a new shelf' })
  @Post()
  create(@Body() dto: CreateShelfDto): Promise<Shelf> {
    return this.shelfService.create(dto);
  }

  @ApiOperation({ summary: 'List shelves with pagination and filters' })
  @Get()
  findAll(
    @Query() query: FindShelvesQueryDto,
  ): Promise<{ data: Shelf[]; meta: PaginationMeta }> {
    return this.shelfService.findAll(query);
  }

  @ApiOperation({ summary: 'Get shelf by ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Shelf> {
    return this.shelfService.findById(id);
  }

  @ApiOperation({ summary: 'Update shelf' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShelfDto): Promise<Shelf> {
    return this.shelfService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete (soft-delete) shelf' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.shelfService.remove(id);
  }
}
