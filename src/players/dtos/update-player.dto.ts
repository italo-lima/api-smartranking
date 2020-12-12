import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePlayerDTO {
  /*@IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly name: string;
  */

  @IsOptional()
  urlImagePlayer?: string;

  @IsOptional()
  category?: string;
}
