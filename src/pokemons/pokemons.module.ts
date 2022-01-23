import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Pokemon } from './models/pokemon.model';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { TypesModule } from 'src/types/types.module';

@Module({
  controllers: [PokemonsController],
  exports: [SequelizeModule],
  providers: [PokemonsService],
  imports: [
    SequelizeModule.forFeature([Pokemon]),
    JwtModule.register({}),
    TypesModule,
  ],
})
export class PokemonsModule {}
