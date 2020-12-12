import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../challenge-status.enum';

export class ChallengeStatusValidacaoPipe implements PipeTransform {
  readonly statusPermitidos = [
    ChallengeStatus.ACCEPT,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.ehStatusValido(status)) {
      throw new BadRequestException(`${status} is a state invalid`);
    }

    return value;
  }

  private ehStatusValido(status: any) {
    const idx = this.statusPermitidos.indexOf(status);
    // -1 se o elemento não for encontrado
    return idx !== -1;
  }
}
