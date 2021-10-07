import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { TypesService } from 'src/types/types.service';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon) private pokemonsRepository: Repository<Pokemon>,
    private typesService: TypesService,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const pokemon = this.pokemonsRepository.create(createPokemonDto);
    const types = await this.typesService.findByIds(createPokemonDto.type_id);

    if (createPokemonDto.type_id.length && !types.length) {
      throw new HttpException('Type(s) is not exists', HttpStatus.NOT_FOUND);
    }

    pokemon.type = types;

    return this.pokemonsRepository.save(pokemon);
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonsRepository.find({
      relations: ['type'],
      order: { number: 'ASC' },
    });
  }

  async findOneById(id: number): Promise<Pokemon> {
    return this.pokemonsRepository.findOne(id);
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const { type_id, ...pokemonUpdateData } = updatePokemonDto;
    const pokemon = await this.pokemonsRepository.findOne(id);
    const types = await this.typesService.findByIds(type_id);

    if (!pokemon) {
      throw new HttpException('Pokemon is not exists', HttpStatus.NOT_FOUND);
    }

    if (type_id.length && !types.length) {
      throw new HttpException('Type(s) is not exists', HttpStatus.NOT_FOUND);
    }

    pokemon.type = types;

    return this.pokemonsRepository.save({ ...pokemon, ...pokemonUpdateData });
  }

  async remove(id: number): Promise<void> {
    await this.pokemonsRepository.delete(id);
  }
}
