import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthenticationController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { SessionModule } from 'src/session/session.module';
import { AuthService } from './auth.service';

dotenv.config();

@Module({
  imports: [
    SessionModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthService],
})
export class AuthenticationModule {}
