import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from 'src/user/models/users.model';

@Table
export class Token extends Model {
  @Column
  refreshToken: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;
}
