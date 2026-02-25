import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckStockItemDto {
  @ApiProperty({ example: 'ABCD', type: 'string' })
  @IsString()
  @IsNotEmpty()
  medicineCode: string;

  @ApiProperty({ example: 10, type: 'number', minimum: 1 })
  @IsInt()
  @IsPositive()
  requiredQuantity: number;
}

export class CheckStockDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @IsUUID('4')
  @IsNotEmpty()
  prescriptionId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: 'string',
  })
  @IsUUID('4')
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ type: [CheckStockItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckStockItemDto)
  items: CheckStockItemDto[];
}

export class StockCheckItemResultDto {
  @ApiProperty({ example: 'ABCD', type: 'string' })
  @IsString()
  @IsNotEmpty()
  medicineCode: string;

  @ApiProperty({ example: 10, type: 'number' })
  @IsInt()
  @IsPositive()
  requiredQuantity: number;

  @ApiProperty({ example: 15, type: 'number' })
  @IsInt()
  @IsPositive()
  availableQuantity: number;

  @ApiProperty({ example: true, type: 'boolean' })
  @IsBoolean()
  sufficient: boolean;
}

export class StockCheckResultDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: 'string',
  })
  @IsUUID('4')
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ example: true, type: 'boolean' })
  @IsBoolean()
  allSufficient: boolean;

  @ApiProperty({ type: [StockCheckItemResultDto] })
  items: StockCheckItemResultDto[];
}
