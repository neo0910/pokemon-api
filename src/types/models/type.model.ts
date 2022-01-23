import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';

import { Pokemon, PokemonType } from 'src/pokemons/models/pokemon.model';

@Table
export class Type extends Model {
  @Column
  name: string;

  @BelongsToMany(() => Pokemon, () => PokemonType)
  pokemon: Pokemon[];
}
