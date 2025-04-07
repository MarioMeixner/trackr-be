import {
  Body,
  Controller,
  Post,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { Response as ResponseType } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body() { email, password }: LoginDto,
    @Response({ passthrough: true }) res: ResponseType,
  ) {
    return await this.authService.login(email, password, res);
  }

  @Post('register')
  @ApiOkResponse({ type: AuthEntity })
  async register(@Body() { name, email, password }: RegisterDto) {
    return await this.authService.register(name, email, password);
  }

  @Post('/refresh')
  @ApiOkResponse({ type: AuthEntity })
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@Response({ passthrough: true }) res: ResponseType) {
    return await this.authService.refreshToken(
      res,
      (res.req.user as UserEntity).id,
    );
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: ResponseType) {
    await this.authService.logout(res, (res.req.user as UserEntity)?.email);
  }
}
