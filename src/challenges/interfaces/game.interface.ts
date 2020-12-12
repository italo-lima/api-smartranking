import { IPlayer } from '../../players/interfaces/player.interface';

export interface IGame {
  category?: string;
  challenge?: string;
  players?: IPlayer[];
  def?: IPlayer;
  result?: IResult[];
}

export interface IResult {
  set: string;
}
