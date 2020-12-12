import { IsNotEmpty } from 'class-validator';
import { IPlayer } from '../../players/interfaces/player.interface';
import { IResult } from '../interfaces/game.interface';

export class AssignMatchChallengeDto {
  @IsNotEmpty()
  def: IPlayer;

  @IsNotEmpty()
  result: Array<IResult>;
}
