import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly category: string;
}
