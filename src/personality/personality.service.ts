import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personality } from './entities/personality.entity';
import { CreatePersonalityDto } from './dto/create-personality.dto';
import { UpdatePersonalityDto } from './dto/update-personality.dto';
import { FriendsService } from '../friends/friends.service';
import { User } from '../users/entities/user.entity';
import { getMBTIType } from './constants/mbti-types';

@Injectable()
export class PersonalityService {
  constructor(
    @InjectRepository(Personality)
    private readonly personalityRepository: Repository<Personality>,
    private readonly friendsService: FriendsService,
  ) {}

  async create(
    friendId: string,
    createPersonalityDto: CreatePersonalityDto,
    user: User,
  ): Promise<Personality> {
    // Check friend existence and access rights
    const friend = await this.friendsService.findOne(friendId, user);

    // Check if personality profile already exists for this friend
    const existingPersonality = await this.personalityRepository.findOne({
      where: { friend: { id: friendId } },
    });

    if (existingPersonality) {
      throw new ConflictException(
        'Personality profile already exists for this friend',
      );
    }

    const personality = this.personalityRepository.create({
      ...createPersonalityDto,
      friend,
    });

    return this.personalityRepository.save(personality);
  }

  async findOne(friendId: string, user: User): Promise<Personality> {
    // Check friend existence and access rights
    await this.friendsService.findOne(friendId, user);

    const personality = await this.personalityRepository.findOne({
      where: { friend: { id: friendId } },
    });

    if (!personality) {
      throw new NotFoundException('Personality profile not found');
    }

    return personality;
  }

  async update(
    friendId: string,
    updatePersonalityDto: UpdatePersonalityDto,
    user: User,
  ): Promise<Personality> {
    const personality = await this.findOne(friendId, user);
    Object.assign(personality, updatePersonalityDto);
    return this.personalityRepository.save(personality);
  }

  async remove(friendId: string, user: User): Promise<void> {
    const personality = await this.findOne(friendId, user);
    await this.personalityRepository.remove(personality);
  }

  async getCompatibilityScore(
    friendId: string,
    otherFriendId: string,
    user: User,
  ): Promise<number> {
    // Check friend existence and access rights
    const [friend1Personality, friend2Personality] = await Promise.all([
      this.findOne(friendId, user),
      this.findOne(otherFriendId, user),
    ]);

    // Calculate compatibility based on MBTI and Big Five
    const mbtiCompatibility = this.calculateMBTICompatibility(
      friend1Personality,
      friend2Personality,
    );
    const bigFiveCompatibility = this.calculateBigFiveCompatibility(
      friend1Personality,
      friend2Personality,
    );

    // Return average compatibility score
    return (mbtiCompatibility + bigFiveCompatibility) / 2;
  }

  async getMBTIType(friendId: string, user: User): Promise<string> {
    const personality = await this.findOne(friendId, user);
    return getMBTIType(personality);
  }

  async getPersonalityAnalysis(friendId: string, user: User) {
    const personality = await this.findOne(friendId, user);
    const mbtiType = getMBTIType(personality);

    return {
      mbtiType,
      mbtiScores: {
        extroversionIntroversion: personality.extroversionIntroversion,
        sensingIntuition: personality.sensingIntuition,
        thinkingFeeling: personality.thinkingFeeling,
        judgingPerceiving: personality.judgingPerceiving,
      },
      bigFiveScores: {
        openness: personality.openness,
        conscientiousness: personality.conscientiousness,
        extraversion: personality.extraversion,
        agreeableness: personality.agreeableness,
        neuroticism: personality.neuroticism,
      },
    };
  }

  private calculateMBTICompatibility(
    personality1: Personality,
    personality2: Personality,
  ): number {
    // Calculate difference for each MBTI scale
    const differences = {
      ei: Math.abs(
        personality1.extroversionIntroversion -
          personality2.extroversionIntroversion,
      ),
      sn: Math.abs(
        personality1.sensingIntuition - personality2.sensingIntuition,
      ),
      tf: Math.abs(personality1.thinkingFeeling - personality2.thinkingFeeling),
      jp: Math.abs(
        personality1.judgingPerceiving - personality2.judgingPerceiving,
      ),
    };

    // Convert differences to compatibility score (0-100)
    const totalDifference = Object.values(differences).reduce(
      (sum, diff) => sum + diff,
      0,
    );
    return Math.max(0, 100 - totalDifference * 12.5); // 12.5 = 100 / (4 * 2)
  }

  private calculateBigFiveCompatibility(
    personality1: Personality,
    personality2: Personality,
  ): number {
    // Calculate difference for each Big Five trait
    const differences = {
      o: Math.abs(personality1.openness - personality2.openness),
      c: Math.abs(
        personality1.conscientiousness - personality2.conscientiousness,
      ),
      e: Math.abs(personality1.extraversion - personality2.extraversion),
      a: Math.abs(personality1.agreeableness - personality2.agreeableness),
      n: Math.abs(personality1.neuroticism - personality2.neuroticism),
    };

    // Convert differences to compatibility score (0-100)
    const totalDifference = Object.values(differences).reduce(
      (sum, diff) => sum + diff,
      0,
    );
    return Math.max(0, 100 - totalDifference * 10); // 10 = 100 / (5 * 2)
  }
}
