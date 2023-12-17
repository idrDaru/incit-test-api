import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { AuthenticationModule } from './auth/auth.module';
import { Session } from './session/session.entity';
import { SessionModule } from './session/session.module';

dotenv.config();

const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  if (process.env.NODE_ENV === 'production') {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Session],
    };
  } else {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Session],
      synchronize: true,
    };
  }
};

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    UserModule,
    AuthenticationModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
