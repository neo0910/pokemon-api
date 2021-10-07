import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { UserController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UsersService],
  controllers: [UserController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
