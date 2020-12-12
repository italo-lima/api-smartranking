import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';
import {ConfigModule} from "@nestjs/config"
import { ChallengesModule } from './challenges/challenges.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CategoriesModule, PlayersModule, ProxyRMQModule, AwsModule, ConfigModule.forRoot({isGlobal: true}), ChallengesModule, RankingsModule, AuthModule],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
