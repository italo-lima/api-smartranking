import { IPlayer } from '../../players/interfaces/player.interface';
import { ChallengeStatus } from '../challenge-status.enum';
import { IGame } from './game.interface';

export interface IChallenge extends Document {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequester: Date;
  dateHourResponse: Date;
  requester: IPlayer;
  category: string;
  game?: IGame;
  players: Array<IPlayer>;
}
