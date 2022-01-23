import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from 'src/auth/auth.module';
import { User } from './models/users.model';
import { UserController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UsersService],
  controllers: [UserController],
  exports: [SequelizeModule, UsersService],
})
export class UsersModule {}
