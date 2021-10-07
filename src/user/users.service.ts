import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: string | number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async activate(activationLink: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { activationLink },
    });

    if (!user) {
      throw new Error('Incorrect activation link');
    }

    user.isActivated = true;
    await this.usersRepository.save(user);
  }
}
