import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './models/pokemon.model';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { TypesService } from 'src/types/types.service';
import { Type } from 'src/types/models/type.model';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectModel(Pokemon) private pokemonsRepository: typeof Pokemon,
    private typesService: TypesService,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const { type_ids, ...payload } = createPokemonDto;

    const types = await this.typesService.findByIds(type_ids);

    if (createPokemonDto.type_ids.length && !types.length) {
      throw new HttpException('Type(s) is not exists', HttpStatus.NOT_FOUND);
    }

    const pokemon = await this.pokemonsRepository.create({ ...payload });
    await pokemon.$add('types', types);

    return this.findOneById(pokemon.id);
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonsRepository.findAll({
      include: {
        model: Type,
        as: 'types',
        through: { attributes: [] },
      },
      order: [['number', 'ASC']],
    });
  }

  async findOneById(id: number): Promise<Pokemon> {
    return this.pokemonsRepository.findByPk(id, {
      include: {
        model: Type,
        as: 'types',
        through: { attributes: [] },
      },
    });
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const { type_ids, ...pokemonUpdateData } = updatePokemonDto;
    const pokemon = await this.findOneById(id);
    const types = await this.typesService.findByIds(type_ids);

    if (!pokemon) {
      throw new HttpException('Pokemon is not exists', HttpStatus.NOT_FOUND);
    }

    if (type_ids.length && !types.length) {
      throw new HttpException('Type(s) is not exists', HttpStatus.NOT_FOUND);
    }

    pokemon.types = types;

    return pokemon.update({ ...pokemon, ...pokemonUpdateData });
  }

  async remove(id: number): Promise<void> {
    const pokemon = await this.findOneById(id);
    await pokemon.destroy();
  }
}
