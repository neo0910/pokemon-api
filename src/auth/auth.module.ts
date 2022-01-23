import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { Token } from './models/token.model';
import { TokenService } from './token.service';
import { UsersModule } from 'src/user/users.module';

@Module({
  controllers: [AuthController],
  exports: [SequelizeModule, AuthService, JwtModule],
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([Token]),
    UsersModule,
  ],
  providers: [AuthService, MailService, TokenService],
})
export class AuthModule {}
