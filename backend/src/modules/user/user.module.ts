import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from './api/controller/user.controller';
import { UserService } from './application/service/user.service';
import { USER_REPOSITORY } from './domain/repository/user.repository';
import { USER_AUTH_REPOSITORY } from './domain/repository/user-auth.repository';
import { MikroOrmUserRepository } from './infrastructure/persistence/repositories/mikroorm-user.repository';
import { MikroOrmUserAuthRepository } from './infrastructure/persistence/repositories/mikroorm-user-auth.repository';
import { UserSchema } from './infrastructure/persistence/schemas/user.schema';
import { UserAuthSchema } from './infrastructure/persistence/schemas/user-auth.schema';

@Module({
  imports: [MikroOrmModule.forFeature([UserSchema, UserAuthSchema])],
  controllers: [UserController],
  providers: [
    UserService,
    MikroOrmUserRepository,
    MikroOrmUserAuthRepository,
    { provide: USER_REPOSITORY, useExisting: MikroOrmUserRepository },
    { provide: USER_AUTH_REPOSITORY, useExisting: MikroOrmUserAuthRepository },
  ],
})
export class UserModule {}
