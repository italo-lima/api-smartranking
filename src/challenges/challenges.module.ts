import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports:[ProxyRMQModule],
  controllers: [ChallengesController]
})
export class ChallengesModule {}
