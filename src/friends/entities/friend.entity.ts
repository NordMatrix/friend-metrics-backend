import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Personality } from '../../personality/entities/personality.entity';
import { Interaction } from '../../interactions/entities/interaction.entity';

@Entity('friends')
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'float', default: 0 })
  relationshipScore: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Personality, (personality) => personality.friend, {
    nullable: true,
  })
  personality: Personality | null;

  @OneToMany(() => Interaction, (interaction) => interaction.friend)
  interactions: Interaction[];
}
