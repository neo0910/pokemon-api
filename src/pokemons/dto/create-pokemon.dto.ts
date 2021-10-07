import { IsNumber, IsString } from 'class-validator';

export class CreatePokemonDto {
  @IsNumber()
  readonly number: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly height: number;

  @IsNumber()
  readonly weight: number;

  @IsNumber({}, { each: true })
  readonly type_id: number[];
}
