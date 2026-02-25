import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateShelfDto {
  @ApiPropertyOptional({ example: 'Shelf S2', type: 'string' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description', type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @IsOptional()
  @IsUUID('4')
  rackId?: string;

  @ApiPropertyOptional({ example: 'MED-001', type: 'string' })
  @IsOptional()
  @IsString()
  medicineCode?: string;

  @ApiPropertyOptional({ example: 200, type: 'number', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  capacity?: number;

  @ApiPropertyOptional({ example: 50, type: 'number', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;
}
