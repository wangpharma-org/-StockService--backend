import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
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

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @IsUUID('4')
  @IsNotEmpty()
  rackId: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', type: 'string' })
  @IsOptional()
  @IsUUID('4')
  medicineSnapshotId?: string;

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

export class MedicineInfoDto {
  @ApiProperty({ example: 'MED-001', type: 'string' })
  @IsString()
  @IsNotEmpty()
  medicineCode: string;

  @ApiPropertyOptional({ example: 'Paracetamol', type: 'string' })
  @IsOptional()
  @IsString()
  medicineName_en?: string;

  @ApiPropertyOptional({ example: 'พาราเซตามอล', type: 'string' })
  @IsOptional()
  @IsString()
  medicineName_th?: string;
}

export class CreateDefaultShelfForNewProductDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @IsUUID('4')
  @IsNotEmpty()
  medicineId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @IsUUID('4')
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ type: MedicineInfoDto })
  @ValidateNested()
  @Type(() => MedicineInfoDto)
  info: MedicineInfoDto;
}