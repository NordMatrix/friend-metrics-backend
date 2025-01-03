import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}

  async create(createFriendDto: CreateFriendDto, user: User): Promise<Friend> {
    const friend = this.friendRepository.create({
      ...createFriendDto,
      user,
    });
    return this.friendRepository.save(friend);
  }

  async findAll(user: User): Promise<Friend[]> {
    return this.friendRepository.find({
      where: { user: { id: user.id } },
      relations: ['personality'],
    });
  }

  async findOne(id: string, user: User): Promise<Friend> {
    const friend = await this.friendRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['personality'],
    });

    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    if (friend.user.id !== user.id) {
      throw new UnauthorizedException();
    }

    return friend;
  }

  async update(
    id: string,
    updateFriendDto: UpdateFriendDto,
    user: User,
  ): Promise<Friend> {
    const friend = await this.findOne(id, user);
    Object.assign(friend, updateFriendDto);
    return this.friendRepository.save(friend);
  }

  async remove(id: string, user: User): Promise<void> {
    await this.findOne(id, user);
    await this.friendRepository.delete({ id, user: { id: user.id } });
  }

  async updateScore(
    id: string,
    updateScoreDto: UpdateScoreDto,
    user: User,
  ): Promise<Friend> {
    const friend = await this.findOne(id, user);

    if (updateScoreDto.scoreChange < -100 || updateScoreDto.scoreChange > 100) {
      throw new BadRequestException(
        'Score change must be between -100 and 100',
      );
    }

    const newScore = friend.relationshipScore + updateScoreDto.scoreChange;
    if (newScore < 0 || newScore > 100) {
      throw new BadRequestException('Final score must be between 0 and 100');
    }

    friend.relationshipScore = newScore;
    return this.friendRepository.save(friend);
  }
}
