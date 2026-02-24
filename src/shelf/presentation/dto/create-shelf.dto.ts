import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateShelfDto {
  @ApiProperty({ example: 'Shelf S1', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Top shelf', type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', type: 'string' })
  @IsUUID('4')
  @IsNotEmpty()
  rackId: string;

  @ApiPropertyOptional({ example: 'MED-001', type: 'string' })
  @IsOptional()
  @IsString()
  medicineCode?: string;

  @ApiPropertyOptional({ example: 100, type: 'number', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  capacity?: number;

  @ApiPropertyOptional({ example: 0, type: 'number', minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;
}

export class CreateDefaultShelfForNewProductDto {
    @ApiProperty({ example: 'MED-001', type: 'string' })
    @IsString()
    @IsNotEmpty()
    medicineCode: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', type: 'string' })
    @IsUUID('4')
    @IsNotEmpty()
    roomId: string;
}
