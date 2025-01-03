import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Friend } from '../../friends/entities/friend.entity';

@Entity()
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string; // Type of interaction (meeting, call, message, etc.)

  @Column('float')
  scoreChange: number; // Impact on relationship score (-100 to 100)

  @ManyToOne(() => Friend, { onDelete: 'CASCADE' })
  friend: Friend;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>; // Additional interaction data

  @CreateDateColumn()
  createdAt: Date;
}
