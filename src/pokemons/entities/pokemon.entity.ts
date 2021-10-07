import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Type } from 'src/types/entities/type.entity';

@Entity()
export class Pokemon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'real' })
  height: number;

  @Column({ type: 'real' })
  weight: number;

  @ManyToMany(() => Type)
  @JoinTable()
  type: Type[];
}
