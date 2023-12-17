import { Injectable } from '@nestjs/common';
import { RequestCreateUserDto } from './dtos/request-create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RequestLoginDto } from 'src/auth/dtos/request-login.dto';
import { ResponseProfileDto } from './dtos/response-profile.dto';
import { RequestChangePasswordDto } from './dtos/request-change-password.dto';
import { ResponseUserListDto, SessionDto } from './dtos/response-user-list.dto';
import { ResponseStatisticDto } from './dtos/response-statistic.dto';
import { SessionService } from 'src/session/session.service';
import { RequestChangeNameDto } from './dtos/request-change-name.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly sessionService: SessionService,
  ) {}

  async create(createUserDto: RequestCreateUserDto): Promise<void> {
    try {
      const existUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existUser) throw 'Email already exists';

      const user = new User();
      user.email = createUserDto.email;
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      user.password = hashedPassword;

      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateUser(loginDto: RequestLoginDto): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({
        email: loginDto.email,
      });

      if (!user) throw 'User not found';
      if (!(await bcrypt.compare(loginDto.password, user.password)))
        throw 'Wrong password';

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async profile(id: number): Promise<ResponseProfileDto> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      const responseProfileDto: ResponseProfileDto = new ResponseProfileDto();
      responseProfileDto.name = user.name;
      responseProfileDto.email = user.email;
      responseProfileDto.isVerified = user.isVerified;
      return responseProfileDto;
    } catch (error) {
      throw new Error(error);
    }
  }

  async changePassword(
    id: number,
    requestChangePasswordDto: RequestChangePasswordDto,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (
        !(await bcrypt.compare(
          requestChangePasswordDto.oldPassword,
          user.password,
        ))
      )
        throw 'Wrong password';
      const hashedPassword = await bcrypt.hash(
        requestChangePasswordDto.newPassword,
        10,
      );
      user.password = hashedPassword;
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async userList(): Promise<ResponseUserListDto[]> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .loadRelationCountAndMap(
          'user.loginCount',
          'user.sessions',
          'loginCount',
        )
        .loadRelationCountAndMap(
          'user.currentActiveSessionCount',
          'user.sessions',
          'currentActiveSessionCount',
          (qb) => qb.where('currentActiveSessionCount.logoutTime IS NULL'),
        )
        .getMany();
      const result: ResponseUserListDto[] = [];

      const latestLogoutTimes = await this.userRepository
        .createQueryBuilder()
        .select('user.id', 'userId')
        .addSelect('MAX(session.logoutTime)', 'latestLogoutTime')
        .from(User, 'user')
        .leftJoin('user.sessions', 'session')
        .groupBy('user.id')
        .getRawMany();

      users.forEach((value, index) => {
        const latestLogoutTime = latestLogoutTimes.find(
          (time) => time.userId === value.id,
        );
        const tmpResult: ResponseUserListDto = new ResponseUserListDto();
        tmpResult.signUpDate = value.createdAt;
        tmpResult.name = value.name;

        const tmpSession: SessionDto = new SessionDto();
        tmpSession.loginCount = value.loginCount;
        tmpSession.latestLogoutDate = latestLogoutTime.latestLogoutTime;
        tmpSession.currentActiveSessionCount = value.currentActiveSessionCount;

        tmpResult.session = tmpSession;
        result.push(tmpResult);
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new Error(error);
    }
  }

  async statistic(): Promise<ResponseStatisticDto> {
    try {
      const users = await this.userRepository.find();

      const todayActiveSessionCount =
        await this.sessionService.getTodayActiveSessionCount();
      const avgActiveSessionLast7Days =
        await this.sessionService.getAvgActiveSessionLast7Days();

      const statistic = new ResponseStatisticDto();
      statistic.userCount = users.length;
      statistic.todayActiveSessionCount = todayActiveSessionCount;
      statistic.avgActiveSessionLast7Days = avgActiveSessionLast7Days;
      return statistic;
    } catch (error) {
      throw new Error(error);
    }
  }

  async changeName(
    id: number,
    requestChangeNameDto: RequestChangeNameDto,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      user.name = requestChangeNameDto.name;
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }
}
