import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [ProxyRMQModule, AwsModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
