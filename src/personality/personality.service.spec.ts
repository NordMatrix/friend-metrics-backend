import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalityService } from './personality.service';
import { Personality } from './entities/personality.entity';
import { FriendsService } from '../friends/friends.service';
import { CreatePersonalityDto } from './dto/create-personality.dto';
import { UpdatePersonalityDto } from './dto/update-personality.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Friend } from '../friends/entities/friend.entity';

describe('PersonalityService', () => {
  let service: PersonalityService;
  let personalityRepository: Repository<Personality>;
  let friendsService: FriendsService;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    googleId: null,
  };

  const mockOtherUser: Partial<User> = {
    id: '2',
    email: 'other@example.com',
    firstName: 'Other',
    lastName: 'User',
    password: 'hashedPassword',
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    googleId: null,
  };

  const mockFriend: Partial<Friend> = {
    id: '1',
    name: 'Test Friend',
    user: mockUser as User,
    avatar: null,
    relationshipScore: 0,
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPersonality: Personality = {
    id: '1',
    extroversionIntroversion: 50,
    sensingIntuition: 30,
    thinkingFeeling: 20,
    judgingPerceiving: 40,
    openness: 70,
    conscientiousness: 80,
    extraversion: 60,
    agreeableness: 75,
    neuroticism: 45,
    friend: mockFriend as Friend,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonalityService,
        {
          provide: getRepositoryToken(Personality),
          useValue: {
            create: jest.fn().mockReturnValue(mockPersonality),
            save: jest.fn().mockResolvedValue(mockPersonality),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: FriendsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockFriend),
          },
        },
      ],
    }).compile();

    service = module.get<PersonalityService>(PersonalityService);
    personalityRepository = module.get<Repository<Personality>>(
      getRepositoryToken(Personality),
    );
    friendsService = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreatePersonalityDto = {
      extroversionIntroversion: 50,
      sensingIntuition: 30,
      thinkingFeeling: 20,
      judgingPerceiving: 40,
      openness: 70,
      conscientiousness: 80,
      extraversion: 60,
      agreeableness: 75,
      neuroticism: 45,
    };

    it('should create a personality profile', async () => {
      jest.spyOn(personalityRepository, 'findOne').mockResolvedValue(null);

      const result = await service.create('1', createDto, mockUser as User);

      expect(result).toEqual(mockPersonality);
      expect(personalityRepository.create).toHaveBeenCalledWith({
        ...createDto,
        friend: mockFriend,
      });
    });

    it('should throw ConflictException if personality profile already exists', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);

      await expect(
        service.create('1', createDto, mockUser as User),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw UnauthorizedException if user does not own the friend', async () => {
      jest
        .spyOn(friendsService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        service.create('1', createDto, mockOtherUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if friend does not exist', async () => {
      jest
        .spyOn(friendsService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.create('999', createDto, mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a personality profile', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);

      const result = await service.findOne('1', mockUser as User);

      expect(result).toEqual(mockPersonality);
    });

    it('should throw NotFoundException if personality profile not found', async () => {
      jest.spyOn(personalityRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1', mockUser as User)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user does not own the friend', async () => {
      jest
        .spyOn(friendsService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      await expect(service.findOne('1', mockOtherUser as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdatePersonalityDto = {
      openness: 80,
      conscientiousness: 85,
    };

    it('should update a personality profile', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);
      const updatedPersonality = { ...mockPersonality, ...updateDto };
      jest
        .spyOn(personalityRepository, 'save')
        .mockResolvedValue(updatedPersonality);

      const result = await service.update('1', updateDto, mockUser as User);

      expect(result).toEqual(updatedPersonality);
    });

    it('should throw NotFoundException if personality profile not found', async () => {
      jest.spyOn(personalityRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update('1', updateDto, mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user does not own the friend', async () => {
      jest
        .spyOn(friendsService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        service.update('1', updateDto, mockOtherUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should update only specified fields', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);
      const partialUpdateDto: UpdatePersonalityDto = { openness: 90 };
      const expectedUpdate = { ...mockPersonality, openness: 90 };
      jest
        .spyOn(personalityRepository, 'save')
        .mockResolvedValue(expectedUpdate);

      const result = await service.update(
        '1',
        partialUpdateDto,
        mockUser as User,
      );

      expect(result.openness).toBe(90);
      expect(result.conscientiousness).toBe(mockPersonality.conscientiousness);
    });
  });

  describe('remove', () => {
    it('should remove a personality profile', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);

      await service.remove('1', mockUser as User);

      expect(personalityRepository.remove).toHaveBeenCalledWith(
        mockPersonality,
      );
    });

    it('should throw NotFoundException if personality profile not found', async () => {
      jest.spyOn(personalityRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('1', mockUser as User)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user does not own the friend', async () => {
      jest
        .spyOn(friendsService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      await expect(service.remove('1', mockOtherUser as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getCompatibilityScore', () => {
    const mockPersonality2: Personality = {
      ...mockPersonality,
      id: '2',
      extroversionIntroversion: -30,
      openness: 60,
    };

    it('should calculate compatibility score between two personalities', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValueOnce(mockPersonality)
        .mockResolvedValueOnce(mockPersonality2);

      const result = await service.getCompatibilityScore(
        '1',
        '2',
        mockUser as User,
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should throw NotFoundException if either personality profile not found', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValueOnce(mockPersonality)
        .mockResolvedValueOnce(null);

      await expect(
        service.getCompatibilityScore('1', '2', mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user does not own either friend', async () => {
      jest
        .spyOn(friendsService, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        service.getCompatibilityScore('1', '2', mockOtherUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should calculate different scores for different personality combinations', async () => {
      const personality1 = {
        ...mockPersonality,
        extroversionIntroversion: 100,
        sensingIntuition: 100,
        thinkingFeeling: 100,
        judgingPerceiving: 100,
        openness: 100,
        conscientiousness: 100,
        extraversion: 100,
        agreeableness: 100,
        neuroticism: 100,
      };

      const personality2 = {
        ...mockPersonality,
        extroversionIntroversion: -100,
        sensingIntuition: -100,
        thinkingFeeling: -100,
        judgingPerceiving: -100,
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0,
      };

      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValueOnce(personality1)
        .mockResolvedValueOnce(personality2);

      const score = await service.getCompatibilityScore(
        '1',
        '2',
        mockUser as User,
      );
      expect(score).toBe(0); // Maximum difference should result in 0% compatibility
    });
  });

  describe('getMBTIType', () => {
    it('should return MBTI type', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);

      const result = await service.getMBTIType('1', mockUser as User);

      expect(result).toBeDefined();
      expect(result).toMatch(/^[EI][SN][TF][JP]$/);
    });

    it('should return ESTJ for positive values', async () => {
      const positivePersonality: Personality = {
        ...mockPersonality,
        extroversionIntroversion: 50,
        sensingIntuition: 50,
        thinkingFeeling: 50,
        judgingPerceiving: 50,
      };
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(positivePersonality);

      const result = await service.getMBTIType('1', mockUser as User);

      expect(result).toBe('ESTJ');
    });

    it('should return INFP for negative values', async () => {
      const negativePersonality: Personality = {
        ...mockPersonality,
        extroversionIntroversion: -50,
        sensingIntuition: -50,
        thinkingFeeling: -50,
        judgingPerceiving: -50,
      };
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(negativePersonality);

      const result = await service.getMBTIType('1', mockUser as User);

      expect(result).toBe('INFP');
    });
  });

  describe('getPersonalityAnalysis', () => {
    it('should return personality analysis', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);

      const result = await service.getPersonalityAnalysis(
        '1',
        mockUser as User,
      );

      expect(result).toHaveProperty('mbtiType');
      expect(result).toHaveProperty('mbtiScores');
      expect(result).toHaveProperty('bigFiveScores');
    });

    it('should return correct MBTI scores', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);

      const result = await service.getPersonalityAnalysis(
        '1',
        mockUser as User,
      );

      expect(result.mbtiScores).toEqual({
        extroversionIntroversion: mockPersonality.extroversionIntroversion,
        sensingIntuition: mockPersonality.sensingIntuition,
        thinkingFeeling: mockPersonality.thinkingFeeling,
        judgingPerceiving: mockPersonality.judgingPerceiving,
      });
    });

    it('should return correct Big Five scores', async () => {
      jest
        .spyOn(personalityRepository, 'findOne')
        .mockResolvedValue(mockPersonality);

      const result = await service.getPersonalityAnalysis(
        '1',
        mockUser as User,
      );

      expect(result.bigFiveScores).toEqual({
        openness: mockPersonality.openness,
        conscientiousness: mockPersonality.conscientiousness,
        extraversion: mockPersonality.extraversion,
        agreeableness: mockPersonality.agreeableness,
        neuroticism: mockPersonality.neuroticism,
      });
    });

    it('should throw NotFoundException if personality profile not found', async () => {
      jest.spyOn(personalityRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.getPersonalityAnalysis('1', mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
