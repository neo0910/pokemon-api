import { Column, Default, HasOne, Model, Table } from 'sequelize-typescript';
import { Exclude } from 'class-transformer';

import { Token } from 'src/auth/models/token.model';

@Table
export class User extends Model {
  @Column({ unique: true })
  email: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  @Exclude({ toPlainOnly: true })
  password: string;

  @Default(false)
  @Column
  isActivated: boolean;

  @Column
  @Exclude({ toPlainOnly: true })
  activationLink: string;

  @HasOne(() => Token)
  token: Token;
}
