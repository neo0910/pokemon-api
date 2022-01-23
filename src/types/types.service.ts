import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './models/type.model';

@Injectable()
export class TypesService {
  constructor(@InjectModel(Type) private typesRepository: typeof Type) {}

  async create(createTypeDto: CreateTypeDto) {
    return this.typesRepository.create(createTypeDto as any);
  }

  async findAll() {
    return this.typesRepository.findAll();
  }

  async findOne(id: number) {
    return this.typesRepository.findByPk(id);
  }

  async findByIds(ids: number[]) {
    return this.typesRepository.findAll({ where: { id: ids } });
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const type = await this.findOne(id);

    if (!type) {
      throw new HttpException('Type is not exists', HttpStatus.NOT_FOUND);
    }

    return type.update(updateTypeDto);
  }

  async remove(id: number) {
    const type = await this.findOne(id);
    await type.destroy();
  }
}
