import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column('timestamp', { nullable: true })
  loginTime: Date;

  @Column('timestamp', { nullable: true })
  logoutTime: Date;

  @Column('text', { unique: true })
  access_token: string;
}
