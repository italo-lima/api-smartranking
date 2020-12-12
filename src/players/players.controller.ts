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
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Observable } from 'rxjs';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../aws/aws.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('_id') _id: string) {
    const player = await this.clientAdminBackend
      .send('get-players', _id)
      .toPromise();

    if (!player) {
      throw new BadRequestException(`Player not found!`);
    }

    //Enviar o arquivo para o S3 e recuperar a URL de acesso
    const urlImagePlayer = await this.awsService.uploadFileS3(file, _id);

    //Atualizar o atributo URL da entidade jogador
    const updatePlayerDTO: UpdatePlayerDTO = {};
    updatePlayerDTO.urlImagePlayer = urlImagePlayer.url;

    await this.clientAdminBackend.emit('update-player', {
      id: _id,
      player: updatePlayerDTO,
    });

    //Retornar o jogador atualizado para o cliente
    return this.clientAdminBackend.send('get-players', _id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    this.logger.log(`criarJogadorDto: ${JSON.stringify(createPlayerDTO)}`);

    const category = await this.clientAdminBackend
      .send('get-categories', createPlayerDTO.category)
      .toPromise();

    if (!category) {
      throw new BadRequestException(`Category not registed`);
    }

    await this.clientAdminBackend.emit('create-player', createPlayerDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getPlayers(@Query('idPlayer') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-players', _id || '');
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', ValidationParamsPipe) _id: string,
  ) {
    const category = await this.clientAdminBackend
      .send('get-categories', updatePlayerDTO.category)
      .toPromise();

    if (!category) {
      throw new BadRequestException(`Category not registed`);
    }

    await this.clientAdminBackend.emit('update-player', {
      id: _id,
      player: updatePlayerDTO,
    });
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', ValidationParamsPipe) _id: string) {
    await this.clientAdminBackend.emit('delete-player', { _id });
  }
}
