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
import { RoomService } from '../application/room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FindRoomsQueryDto } from './dto/find-rooms-query.dto';
import { Room } from '../domain/room.entity';
import { PaginationMeta } from '../../common/utils/pagination.util';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Create a new room' })
  @Post()
  create(@Body() dto: CreateRoomDto): Promise<Room> {
    return this.roomService.create(dto);
  }

  @ApiOperation({ summary: 'List rooms with pagination and filters' })
  @Get()
  findAll(
    @Query() query: FindRoomsQueryDto,
  ): Promise<{ data: Room[]; meta: PaginationMeta }> {
    return this.roomService.findAll(query);
  }

  @ApiOperation({ summary: 'Get room by ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Room> {
    return this.roomService.findById(id);
  }

  @ApiOperation({ summary: 'Update room' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete (soft-delete) room' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.roomService.remove(id);
  }
}
