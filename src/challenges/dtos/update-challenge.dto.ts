import { ChallengeStatus } from '../challenge-status.enum';
import { IsOptional } from 'class-validator';

export class UpdateChallengeDto {
  @IsOptional()
  status: ChallengeStatus;
}
