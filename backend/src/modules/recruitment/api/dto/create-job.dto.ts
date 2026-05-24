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

  @ApiPropertyOptional({
    description: '必备技能',
    example: 'Vue,TypeScript',
  })
  @IsOptional()
  @IsString()
  requiredSkills?: string;

  @ApiPropertyOptional({
    description: '优先技能',
    example: 'React,Node.js',
  })
  @IsOptional()
  @IsString()
  preferredSkills?: string;
}
