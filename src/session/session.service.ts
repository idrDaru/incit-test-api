import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Session } from './session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
  ) {}
  async login(user: User, access_token: string): Promise<void> {
    try {
      const session = new Session();
      session.user = user;
      session.loginTime = new Date();
      session.access_token = access_token;
      await this.sessionRepository.save(session);
    } catch (error) {
      throw new Error(error);
    }
  }

  async logout(access_token: string): Promise<void> {
    try {
      const session = await this.sessionRepository.findOne({
        where: { access_token },
      });
      session.logoutTime = new Date();
      await this.sessionRepository.save(session);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTodayActiveSessionCount(): Promise<number> {
    try {
      // Set the start and end date for today (without considering time)
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of the day
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to end of the day

      const sessions = await this.sessionRepository
        .createQueryBuilder('session')
        .where('session.logoutTime IS NULL')
        .andWhere('session.loginTime BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .getCount();
      return sessions;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAvgActiveSessionLast7Days(): Promise<number> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Calculate 7 days ago

      const result = await this.sessionRepository
        .createQueryBuilder('session')
        .select(
          'DATE(session.loginTime) AS loginDate, COUNT(session.id) AS loginCount',
        )
        .where('session.loginTime >= :startDate', { startDate })
        .groupBy('DATE(session.loginTime)')
        .getRawMany();

      // Calculate average login count
      const totalLoginCount: number = result.reduce(
        (sum, entry) => sum + parseInt(entry.logincount),
        0,
      );
      const averageLoginCount: number = totalLoginCount / 7;
      return averageLoginCount;
    } catch (error) {
      throw new Error(error);
    }
  }
}
