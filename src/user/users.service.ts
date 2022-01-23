import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private usersRepository: typeof User) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(createUserDto as any);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOneById(id: string | number): Promise<User> {
    return this.usersRepository.findByPk(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);
    await user.destroy();
  }

  async activate(activationLink: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { activationLink },
    });

    if (!user) {
      throw new Error('Incorrect activation link');
    }

    user.isActivated = true;
    await user.save();
  }
}
