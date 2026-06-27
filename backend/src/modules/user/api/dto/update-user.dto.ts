import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsEmail,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户昵称', example: '张三' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @ApiPropertyOptional({
    description: '头像URL',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarUrl?: string;

  @ApiPropertyOptional({ description: '绑定邮箱', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: '用户状态: 0-禁用, 1-正常', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  status?: number;
}
