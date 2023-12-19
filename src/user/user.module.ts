import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { SessionModule } from 'src/session/session.module';
import { MailingModule } from 'src/mailing/mailing.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SessionModule, MailingModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
