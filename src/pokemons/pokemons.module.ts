import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pokemon } from './entities/pokemon.entity';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { TypesModule } from 'src/types/types.module';

@Module({
  controllers: [PokemonsController],
  exports: [TypeOrmModule],
  providers: [PokemonsService],
  imports: [
    TypeOrmModule.forFeature([Pokemon]),
    JwtModule.register({}),
    TypesModule,
  ],
})
export class PokemonsModule {}
