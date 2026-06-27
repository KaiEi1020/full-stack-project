import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户昵称', example: '张三' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nickname!: string;

  @ApiPropertyOptional({ description: '头像URL', example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarUrl?: string;

  @ApiPropertyOptional({ description: '绑定邮箱', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ description: '用户名/邮箱（用于登录）', example: 'zhangsan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  identifier!: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}
