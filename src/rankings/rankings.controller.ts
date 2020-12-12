import { Controller, BadRequestException, Get, Query } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Observable } from 'rxjs';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientRankingsBackend = this.clientProxySmartRanking.getClientProxyRankingsInstance();

  @Get()
  getRankings(
    @Query('idCategory') idCategory: string,
    @Query('dateRef') dateRef: string,
  ): Observable<any> {
    if (!idCategory) {
      throw new BadRequestException('Id of category is mandatory');
    }

    return this.clientRankingsBackend.send('get-rankings', {
      idCategory: idCategory,
      dateRef: dateRef ? dateRef : '',
    });
  }
}
