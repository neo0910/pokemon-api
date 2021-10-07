import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { Pokemon } from './pokemons/entities/pokemon.entity';
import { PokemonsModule } from './pokemons/pokemons.module';
import { Token } from './auth/entities/token.entity';
import { Type } from './types/entities/type.entity';
import { TypesModule } from './types/types.module';
import { User } from './user/entities/user.entity';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Token, Pokemon, Type],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    AuthModule,
    PokemonsModule,
    TypesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
