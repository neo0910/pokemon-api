import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule } from './auth/auth.module';
import { Pokemon, PokemonType } from './pokemons/models/pokemon.model';
import { PokemonsModule } from './pokemons/pokemons.module';
import { Token } from './auth/models/token.model';
import { Type } from './types/models/type.model';
import { TypesModule } from './types/types.module';
import { User } from './user/models/users.model';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Pokemon, PokemonType, Token, User, Type],
      autoLoadModels: true,
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
