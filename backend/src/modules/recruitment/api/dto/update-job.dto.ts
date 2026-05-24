import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateJobDto {
  @ApiPropertyOptional({ description: '职位名称', example: '高级前端工程师' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ description: '职位描述' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ description: '必备技能 (JSON 字符串)' })
  @IsOptional()
  @IsString()
  requiredSkills?: string;

  @ApiPropertyOptional({ description: '优先技能 (JSON 字符串)' })
  @IsOptional()
  @IsString()
  preferredSkills?: string;
}
