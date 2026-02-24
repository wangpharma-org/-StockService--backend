import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateRackDto {
  @ApiProperty({ example: 'Rack A1', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Lower rack', type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', type: 'string' })
  @IsUUID('4')
  @IsNotEmpty()
  zoneId: string;
}
