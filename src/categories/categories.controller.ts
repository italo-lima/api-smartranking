import {
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Query,
  Put,
  Param,
} from '@nestjs/common';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Controller('api/v1/categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    this.logger.log(`Category: ${createCategoryDTO}`);
    this.clientAdminBackend.emit('create-category', createCategoryDTO);
  }

  @Get()
  getAllCategories(@Query('idCategory') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-categories', _id || '');
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('update-category', {
      id: _id,
      category: updateCategoryDTO,
    });
  }
}
