import { Session } from 'src/session/session.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true })
  password: string;

  @Column('text', { nullable: true })
  name: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column('timestamp', { default: new Date() })
  createdAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  loginCount: number;

  latestLogoutTime: Date;

  currentActiveSessionCount: number;
}
