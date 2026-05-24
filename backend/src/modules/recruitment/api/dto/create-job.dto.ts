import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ description: '职位ID', example: 'uuid' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: '职位名称', example: '前端工程师' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ description: '职位描述', example: '负责前端开发工作' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description!: string;

  @ApiPropertyOptional({ description: '必备技能 (JSON 字符串)', example: '["Vue", "TypeScript"]' })
  @IsOptional()
  @IsString()
  requiredSkills?: string;

  @ApiPropertyOptional({ description: '优先技能 (JSON 字符串)', example: '["React", "Node.js"]' })
  @IsOptional()
  @IsString()
  preferredSkills?: string;
}

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
