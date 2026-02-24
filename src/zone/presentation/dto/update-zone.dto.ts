import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateZoneDto {
  @ApiPropertyOptional({ example: 'Zone 2', type: 'string' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description', type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', type: 'string' })
  @IsOptional()
  @IsUUID('4')
  roomId?: string;
}
