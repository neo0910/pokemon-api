import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PokemonsService } from './pokemons.service';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('api/pokemons')
@UseGuards(JwtAuthGuard)
export class PokemonsController {
  constructor(private pokemonsService: PokemonsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() pokemon: CreatePokemonDto) {
    return this.pokemonsService.create(pokemon);
  }

  @Get()
  async getAll(@Query('limit') limit?: string) {
    const data = await this.pokemonsService.findAll();
    if (typeof limit !== 'undefined') {
      return data.slice(0, +limit);
    }

    return data;
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonsService.findOneById(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() pokemon: UpdatePokemonDto,
  ) {
    return this.pokemonsService.update(id, pokemon);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.pokemonsService.remove(id);
    return { removedId: id };
  }
}
