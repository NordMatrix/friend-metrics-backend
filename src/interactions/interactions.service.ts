import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from './entities/interaction.entity';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { FriendsService } from '../friends/friends.service';
import { User } from '../users/entities/user.entity';
import { UpdateScoreDto } from '../friends/dto/update-score.dto';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionRepository: Repository<Interaction>,
    private readonly friendsService: FriendsService,
  ) {}

  async create(friendId: string, createInteractionDto: CreateInteractionDto, user: User): Promise<Interaction> {
    const friend = await this.friendsService.findOne(friendId, user);

    const interaction = this.interactionRepository.create({
      ...createInteractionDto,
      friend,
    });

    await this.interactionRepository.save(interaction);

    // Update friend's relationship score
    await this.friendsService.updateScore(friendId, {
      scoreChange: interaction.scoreChange,
    }, user);

    return interaction;
  }

  async findAll(friendId: string, user: User): Promise<Interaction[]> {
    await this.friendsService.findOne(friendId, user);

    return this.interactionRepository.find({
      where: { friend: { id: friendId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, friendId: string, user: User): Promise<Interaction> {
    await this.friendsService.findOne(friendId, user);

    const interaction = await this.interactionRepository.findOne({
      where: { id, friend: { id: friendId } },
    });

    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }

    return interaction;
  }

  async remove(id: string, friendId: string, user: User): Promise<void> {
    const interaction = await this.findOne(id, friendId, user);
    
    // Update friend's relationship score before deletion
    await this.friendsService.updateScore(friendId, {
      scoreChange: -interaction.scoreChange,
    }, user);
    
    await this.interactionRepository.remove(interaction);
  }

  async getStatistics(friendId: string, user: User) {
    const friend = await this.friendsService.findOne(friendId, user);
    const interactions = await this.interactionRepository.find({
      where: { friend: { id: friendId } },
    });

    const total = interactions.length;
    
    // Count by type
    const byType = interactions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {});
    
    // Count by month
    const byMonth = interactions.reduce((acc, interaction) => {
      const month = interaction.createdAt.toISOString().slice(0, 7); // YYYY-MM format
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    return { total, byType, byMonth };
  }
} 