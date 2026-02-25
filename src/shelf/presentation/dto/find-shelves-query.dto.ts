import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindShelvesQueryDto {
  @ApiPropertyOptional({ example: 1, type: 'number', minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    type: 'number',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional({ example: 'Shelf S1', type: 'string' })
  @IsOptional()
  @IsString()
  name?: string;

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
}
