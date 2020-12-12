import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsCognitoConfig } from './aws-cognito.config';

@Module({
  providers: [AwsService, AwsCognitoService, AwsCognitoConfig],
  exports: [AwsService, AwsCognitoService, AwsCognitoConfig],
})
export class AwsModule {}
