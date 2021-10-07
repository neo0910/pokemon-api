import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Incorrect Email' })
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsString()
  @Length(4, 16)
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly activationLink: string;
}
