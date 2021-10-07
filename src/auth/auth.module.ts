import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { Token } from './entities/token.entity';
import { TokenService } from './token.service';
import { UsersModule } from 'src/user/users.module';

@Module({
  controllers: [AuthController],
  exports: [TypeOrmModule, AuthService, JwtModule],
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Token]),
    UsersModule,
  ],
  providers: [AuthService, MailService, TokenService],
})
export class AuthModule {}
