import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PageRequestDto {
  @ApiProperty({ description: '页码，从 1 开始', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNo!: number;

  @ApiProperty({ description: '每页条数', example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize!: number;
}
