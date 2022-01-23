import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';

import { Token } from './models/token.model';
import { UsersService } from 'src/user/users.service';
import { User } from 'src/user/models/users.model';

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_EXPIRED_IN: string = '30m';
  private readonly REFRESH_TOKEN_EXPIRED_IN: string = '30d';

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectModel(Token) private tokenRepository: typeof Token,
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
      include: [User],
      where: { '$user.id$': userId },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const user = await this.usersService.findOneById(userId);
    const token = await this.tokenRepository.create({ refreshToken, user });
    return token.save();
  }

  async findToken(refreshToken: string): Promise<Token> {
    return this.tokenRepository.findOne({ where: { refreshToken } });
  }

  async removeToken(refreshToken: string): Promise<void> {
    const token = await this.findToken(refreshToken);
    await token.destroy();
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
