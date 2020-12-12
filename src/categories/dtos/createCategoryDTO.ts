import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<IEvent>;
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}