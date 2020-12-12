import {
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  Body,
} from '@nestjs/common';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthSignUpUserDto } from './dtos/auth-signup-user.dto';
import { AwsCognitoService } from '../aws/aws-cognito.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() authRegisterUserDto: AuthSignUpUserDto) {
    return await this.awsCognitoService.registerUser(authRegisterUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUserDto: AuthLoginUserDto) {
    return await this.awsCognitoService.signInUser(authLoginUserDto);
  }
}
