import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Type } from './entities/type.entity';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';

@Module({
  exports: [TypesService],
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([Type])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
