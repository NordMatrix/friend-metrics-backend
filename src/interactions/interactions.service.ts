import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from './entities/interaction.entity';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { FriendsService } from '../friends/friends.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionRepository: Repository<Interaction>,
    private readonly friendsService: FriendsService,
  ) {}

  async create(
    friendId: string,
    createInteractionDto: CreateInteractionDto,
    user: User,
  ): Promise<Interaction> {
    const friend = await this.friendsService.findOne(friendId, user);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    const interaction = this.interactionRepository.create({
      ...createInteractionDto,
      friend,
    });

    await this.friendsService.updateScore(
      friendId,
      { scoreChange: createInteractionDto.scoreChange },
      user,
    );

    return this.interactionRepository.save(interaction);
  }

  async findAll(friendId: string, user: User): Promise<Interaction[]> {
    const friend = await this.friendsService.findOne(friendId, user);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    return this.interactionRepository.find({
      where: { friend: { id: friendId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(
    friendId: string,
    id: string,
    user: User,
  ): Promise<Interaction> {
    const friend = await this.friendsService.findOne(friendId, user);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    const interaction = await this.interactionRepository.findOne({
      where: { id, friend: { id: friendId } },
    });

    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }

    return interaction;
  }

  async remove(friendId: string, id: string, user: User): Promise<void> {
    const friend = await this.friendsService.findOne(friendId, user);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    const interaction = await this.interactionRepository.findOne({
      where: { id, friend: { id: friendId } },
    });

    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }

    await this.interactionRepository.delete({ id, friend: { id: friendId } });
  }

  async getStatistics(
    friendId: string,
    user: User,
  ): Promise<{
    total: number;
    byType: Record<string, number>;
    byMonth: Record<string, number>;
  }> {
    const friend = await this.friendsService.findOne(friendId, user);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    const interactions = await this.interactionRepository.find({
      where: { friend: { id: friendId } },
      order: { createdAt: 'DESC' },
    });

    const total = interactions.length;
    const byType = interactions.reduce(
      (acc, interaction) => {
        acc[interaction.type] = (acc[interaction.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byMonth = interactions.reduce(
      (acc, interaction) => {
        const monthKey = interaction.createdAt.toISOString().slice(0, 7); // YYYY-MM
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, byType, byMonth };
  }
}
