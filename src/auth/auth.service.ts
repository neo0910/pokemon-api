import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailService } from './mail.service';
import { TokenService } from './token.service';
import { UsersService } from 'src/user/users.service';
import { User } from 'src/user/models/users.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    private tokenService: TokenService,
  ) {}

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(userDto.email);

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Incorrect credentials' });
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return { ...tokens, user: user.get() };
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.usersService.findOneByEmail(userDto.email);

    if (candidate) {
      throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
    }

    const hash = await bcrypt.hash(userDto.password, 10);
    const activationLink = v4();

    const user = await this.usersService.create({
      ...userDto,
      password: hash,
      activationLink,
    });

    await this.mailService.sendActivationMail(
      userDto.email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`,
    );

    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: user.get() };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.removeToken(refreshToken);
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneById(userData.id);
    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: user.get() };
  }
}
