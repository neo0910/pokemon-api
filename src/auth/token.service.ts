import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Token } from './entities/token.entity';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_EXPIRED_IN: string = '30m';
  private readonly REFRESH_TOKEN_EXPIRED_IN: string = '30d';

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  async generateTokens(user: User) {
    const payload = { email: user.email, id: user.id };
    const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

    const accessToken = this.jwtService.sign(payload, {
      secret: ACCESS_SECRET_KEY,
      expiresIn: this.ACCESS_TOKEN_EXPIRED_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: REFRESH_SECRET_KEY,
      expiresIn: this.REFRESH_TOKEN_EXPIRED_IN,
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({
      user: { id: userId },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return this.tokenRepository.save(tokenData);
    }

    const user = await this.usersService.findOneById(userId);
    const token = this.tokenRepository.create({ refreshToken, user });
    return this.tokenRepository.save(token);
  }

  async removeToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete({ refreshToken });
  }

  async findToken(refreshToken: string): Promise<Token> {
    return this.tokenRepository.findOne({ refreshToken });
  }

  validateAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.ACCESS_SECRET_KEY,
      });
    } catch (err) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.REFRESH_SECRET_KEY,
      });
    } catch (err) {
      return null;
    }
  }
}
