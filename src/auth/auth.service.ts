import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(res: Response, userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: '7d' });
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: await bcrypt.hash(refreshToken, 10) },
    });
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      domain: 'localhost',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      domain: 'localhost',
    });
    return { accessToken, refreshToken, user };
  }

  async login(
    email: string,
    password: string,
    res: Response,
  ): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
    }
    const { accessToken, refreshToken } = await this.generateTokens(
      res,
      user.id,
    );
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(res: Response, userId: string): Promise<AuthEntity> {
    return await this.generateTokens(res, userId);
  }

  async verifyRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id: userId } });
      if (user?.refreshToken) {
        const autheticated = await bcrypt.compare(
          refreshToken,
          user.refreshToken,
        );
        if (!autheticated) {
          throw new UnauthorizedException('Invalid refresh token');
        }
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response, email: string) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      domain: 'localhost',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      domain: 'localhost',
    });
    await this.prisma.user.update({
      where: { email },
      data: { refreshToken: null },
    });
  }
}
