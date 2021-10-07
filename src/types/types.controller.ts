import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { CreateTypeDto } from './dto/create-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TypesService } from './types.service';
import { UpdateTypeDto } from './dto/update-type.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('api/types')
@UseGuards(JwtAuthGuard)
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createTypeDto: CreateTypeDto) {
    return this.typesService.create(createTypeDto);
  }

  @Get()
  async findAll() {
    return this.typesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTypeDto: UpdateTypeDto,
  ) {
    return this.typesService.update(id, updateTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.typesService.remove(id);
    return { removedId: id };
  }
}
