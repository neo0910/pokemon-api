import { IsString } from 'class-validator';

export class CreateTypeDto {
  @IsString()
  readonly name: string;
}
