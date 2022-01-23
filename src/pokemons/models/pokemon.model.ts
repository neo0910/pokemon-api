import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Type } from 'src/types/models/type.model';

@Table
export class Pokemon extends Model {
  @Column({ unique: true })
  number: number;

  @Column
  name: string;

  @Column
  description: string;

  @Column(DataType.REAL)
  height: number;

  @Column(DataType.REAL)
  weight: number;

  @BelongsToMany(() => Type, () => PokemonType)
  types: Type[];
}

@Table
export class PokemonType extends Model {
  @ForeignKey(() => Pokemon)
  @Column
  pokemonId: number;

  @ForeignKey(() => Type)
  @Column
  typeId: number;
}
