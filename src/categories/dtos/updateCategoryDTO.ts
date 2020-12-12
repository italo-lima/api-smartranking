import { IsOptional, IsString, IsArray, ArrayMinSize } from 'class-validator';
import { IEvent } from './createCategoryDTO';

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  events: Array<IEvent>;
}
