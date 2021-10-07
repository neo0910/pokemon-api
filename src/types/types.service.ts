import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateTypeDto } from './dto/create-type.dto';
import { Type } from './entities/type.entity';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type) private typesRepository: Repository<Type>,
  ) {}

  async create(createTypeDto: CreateTypeDto) {
    const type = this.typesRepository.create(createTypeDto);
    return this.typesRepository.save(type);
  }

  async findAll() {
    return this.typesRepository.find();
  }

  async findOne(id: number) {
    return this.typesRepository.findOne(id);
  }

  async findByIds(ids: number[]) {
    return this.typesRepository.find({ where: { id: In(ids) } });
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const type = await this.typesRepository.findOne(id);

    if (!type) {
      throw new HttpException('Type is not exists', HttpStatus.NOT_FOUND);
    }

    return this.typesRepository.update(id, updateTypeDto);
  }

  async remove(id: number) {
    await this.typesRepository.delete(id);
  }
}
