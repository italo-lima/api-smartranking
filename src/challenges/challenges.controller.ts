import {
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  BadRequestException,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { ChallengeStatusValidacaoPipe } from './pipes/challenge-status-validation';
import { AssignMatchChallengeDto } from './dtos/assign-match-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { IPlayer } from '../players/interfaces/player.interface';
import { IChallenge } from './interfaces/challenge.interterface';
import { ChallengeStatus } from './challenge-status.enum';
import { IGame } from './interfaces/game.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private readonly logger = new Logger(ChallengesController.name);

  private clientChallenges = this.clientProxySmartRanking.getClientProxyChallengesInstance();

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    this.logger.log(`criarDesafioDto: ${JSON.stringify(createChallengeDto)}`);

    const category = await this.clientAdminBackend
      .send('get-categories', createChallengeDto.category)
      .toPromise();

    this.logger.log(`categoria: ${JSON.stringify(category)}`);

    if (!category) {
      throw new BadRequestException(`Categoria informada não existe!`);
    }

    const players: IPlayer[] = await this.clientAdminBackend
      .send('get-players', '')
      .toPromise();

    createChallengeDto.players.map(playerDto => {
      const playerFilter: IPlayer[] = players.filter(
        player => player._id == playerDto._id,
      );

      this.logger.log(`playerFilter: ${JSON.stringify(playerFilter)}`);

      if (playerFilter.length == 0) {
        throw new BadRequestException(`O id ${playerDto._id} is not player!`);
      }

      if (playerFilter[0].category != createChallengeDto.category) {
        throw new BadRequestException(
          `O jogador ${playerFilter[0]._id} não faz parte da categoria informada!`,
        );
      }
    });

    const requesterIsPlayerOfGame: IPlayer[] = createChallengeDto.players.filter(
      player => player._id == createChallengeDto.requester,
    );

    this.logger.log(
      `solicitanteEhJogadorDaPartida: ${JSON.stringify(
        requesterIsPlayerOfGame,
      )}`,
    );

    if (requesterIsPlayerOfGame.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }
    await this.clientChallenges.emit('create-challenge', createChallengeDto);
  }

  @Get()
  async consultarDesafios(@Query('idPlayer') idPlayer: string): Promise<any> {
    if (idPlayer) {
      const player: IPlayer = await this.clientAdminBackend
        .send('get-players', idPlayer)
        .toPromise();
      this.logger.log(`jogador: ${JSON.stringify(player)}`);
      if (!player) {
        throw new BadRequestException(`player not found!`);
      }
    }

    return this.clientChallenges
      .send('get-challenges', { idPlayer: idPlayer, _id: '' })
      .toPromise();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidacaoPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ) {
    const challenge: IChallenge = await this.clientChallenges
      .send('get-challenges', { idPlayer: '', _id: _id })
      .toPromise();

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    if (!challenge) {
      throw new BadRequestException(`challenge not found!`);
    }

    if (challenge.status != ChallengeStatus.PENDING) {
      throw new BadRequestException(
        'Somente desafios com status PENDENTE podem ser atualizados!',
      );
    }

    await this.clientChallenges.emit('update-challenge', {
      id: _id,
      challenge: updateChallengeDto,
    });
  }

  @Delete('/:_id')
  async destroyChallenge(@Param('_id') _id: string) {
    const challenge: IChallenge = await this.clientChallenges
      .send('get-challenges', { idPlayer: '', _id: _id })
      .toPromise();

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    if (!challenge) {
      throw new BadRequestException(`challenge not found!`);
    }

    await this.clientChallenges.emit('delete-challenge', challenge);
  }

  @Post('/:challenge/game')
  async assignMatchChallenge(
    @Body(ValidationPipe) assignMatchChallengeDto: AssignMatchChallengeDto,
    @Param('challenge') _id: string,
  ) {
    const challenge: IChallenge = await this.clientChallenges
      .send('get-challenges', { idPlayer: '', _id: _id })
      .toPromise();

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    if (!challenge) {
      throw new BadRequestException(`challenge not found!`);
    }

    if (challenge.status == ChallengeStatus.ACCOMPLISHED) {
      throw new BadRequestException(`Desafio já realizado!`);
    }

    if (challenge.status != ChallengeStatus.ACCEPT) {
      throw new BadRequestException(
        `Partidas somente podem ser lançadas em desafios aceitos pelos adversários!`,
      );
    }

    if (!challenge.players.includes(assignMatchChallengeDto.def)) {
      throw new BadRequestException(
        `O jogador vencedor da partida deve fazer parte do desafio!`,
      );
    }

    const game: IGame = {};
    game.category = challenge.category;
    game.def = assignMatchChallengeDto.def;
    game.challenge = _id;
    game.players = challenge.players;
    game.result = assignMatchChallengeDto.result;

    await this.clientChallenges.emit('create-game', game);
  }
}
