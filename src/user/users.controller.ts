import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll() {
    return this.usersService.findAll();
  }
}
