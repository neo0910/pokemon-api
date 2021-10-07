import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Req,
  Res,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { THIRTY_DAYS } from 'src/constants';
import { UsersService } from 'src/user/users.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) res) {
    const userData = await this.authService.login(userDto);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
    });

    return userData;
  }

  @Post('/registration')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res,
  ) {
    const userData = await this.authService.registration(userDto);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
    });

    return userData;
  }

  @Post('/logout')
  async logout(@Req() req, @Res({ passthrough: true }) res): Promise<void> {
    const { refreshToken } = req.cookies;
    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
  }

  @Get('/activate/:link')
  @Redirect()
  async activate(@Param() params: { link: string }) {
    try {
      await this.usersService.activate(params.link);
      return { url: process.env.CLIENT_URL };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/refresh')
  @UseInterceptors(ClassSerializerInterceptor)
  async refresh(@Req() req, @Res({ passthrough: true }) res) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
    });

    return userData;
  }
}
