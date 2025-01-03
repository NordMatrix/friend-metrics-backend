import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Friend } from '../../friends/entities/friend.entity';

@Entity('personalities')
export class Personality {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // MBTI characteristics
  @Column('float')
  extroversionIntroversion: number; // E-I scale (-100 to 100)

  @Column('float')
  sensingIntuition: number; // S-N scale (-100 to 100)

  @Column('float')
  thinkingFeeling: number; // T-F scale (-100 to 100)

  @Column('float')
  judgingPerceiving: number; // J-P scale (-100 to 100)

  // Big Five characteristics
  @Column('float')
  openness: number; // 0 to 100

  @Column('float')
  conscientiousness: number; // 0 to 100

  @Column('float')
  extraversion: number; // 0 to 100

  @Column('float')
  agreeableness: number; // 0 to 100

  @Column('float')
  neuroticism: number; // 0 to 100

  @OneToOne(() => Friend, { onDelete: 'CASCADE' })
  @JoinColumn()
  friend: Friend;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
