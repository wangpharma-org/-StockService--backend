import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRoomDto {
  @ApiPropertyOptional({ example: 'Room B', type: 'string' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description', type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;
}
