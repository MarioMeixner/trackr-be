import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TracksModule, PrismaModule, UsersModule, TracksModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
