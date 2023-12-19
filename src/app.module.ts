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
import { MailingModule } from './mailing/mailing.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
      synchronize: true,
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
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    AuthenticationModule,
    SessionModule,
    MailingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
