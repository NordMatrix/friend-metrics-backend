import { Test, TestingModule } from '@nestjs/testing';
import { PersonalityController } from './personality.controller';
import { PersonalityService } from './personality.service';
import { CreatePersonalityDto } from './dto/create-personality.dto';
import { UpdatePersonalityDto } from './dto/update-personality.dto';
import { User } from '../users/entities/user.entity';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Personality } from './entities/personality.entity';

describe('PersonalityController', () => {
  let controller: PersonalityController;
  let service: PersonalityService;

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

  const mockPersonality: Partial<Personality> = {
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAnalysis = {
    mbtiType: 'ESTJ',
    mbtiScores: {
      extroversionIntroversion: 50,
      sensingIntuition: 30,
      thinkingFeeling: 20,
      judgingPerceiving: 40,
    },
    bigFiveScores: {
      openness: 70,
      conscientiousness: 80,
      extraversion: 60,
      agreeableness: 75,
      neuroticism: 45,
    },
  };

  const mockPersonalityService = {
    create: jest.fn().mockResolvedValue(mockPersonality),
    findOne: jest.fn().mockResolvedValue(mockPersonality),
    update: jest.fn().mockResolvedValue(mockPersonality),
    remove: jest.fn().mockResolvedValue(undefined),
    getPersonalityAnalysis: jest.fn().mockResolvedValue(mockAnalysis),
    getMBTIType: jest.fn().mockResolvedValue('ESTJ'),
    getCompatibilityScore: jest.fn().mockResolvedValue(85),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalityController],
      providers: [
        {
          provide: PersonalityService,
          useValue: mockPersonalityService,
        },
      ],
    }).compile();

    controller = module.get<PersonalityController>(PersonalityController);
    service = module.get<PersonalityService>(PersonalityService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      const result = await controller.create('1', createDto, mockUser as User);

      expect(result).toEqual(mockPersonality);
      expect(service.create).toHaveBeenCalledWith(
        '1',
        createDto,
        mockUser as User,
      );
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle ConflictException', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new ConflictException());

      await expect(
        controller.create('1', createDto, mockUser as User),
      ).rejects.toThrow(ConflictException);
    });

    it('should handle UnauthorizedException', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.create('1', createDto, mockUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOne', () => {
    it('should return a personality profile', async () => {
      const result = await controller.findOne('1', mockUser as User);

      expect(result).toEqual(mockPersonality);
      expect(service.findOne).toHaveBeenCalledWith('1', mockUser as User);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('999', mockUser as User)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle UnauthorizedException', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.findOne('1', mockUser as User)).rejects.toThrow(
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
      const result = await controller.update('1', updateDto, mockUser as User);

      expect(result).toEqual(mockPersonality);
      expect(service.update).toHaveBeenCalledWith(
        '1',
        updateDto,
        mockUser as User,
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto: UpdatePersonalityDto = { openness: 90 };
      const expectedUpdate: Partial<Personality> = {
        ...mockPersonality,
        openness: 90,
      };
      jest
        .spyOn(service, 'update')
        .mockResolvedValue(expectedUpdate as Personality);

      const result = await controller.update(
        '1',
        partialUpdateDto,
        mockUser as User,
      );

      expect(result.openness).toBe(90);
      expect(result.conscientiousness).toBe(mockPersonality.conscientiousness);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(
        controller.update('999', updateDto, mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle UnauthorizedException', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.update('1', updateDto, mockUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should remove a personality profile', async () => {
      const result = await controller.remove('1', mockUser as User);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('1', mockUser as User);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should handle NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('999', mockUser as User)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle UnauthorizedException', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.remove('1', mockUser as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getAnalysis', () => {
    it('should return personality analysis with correct MBTI and Big Five scores', async () => {
      const result = await controller.getAnalysis('1', mockUser as User);

      expect(result).toEqual(mockAnalysis);
      expect(service.getPersonalityAnalysis).toHaveBeenCalledWith(
        '1',
        mockUser as User,
      );
      expect(service.getPersonalityAnalysis).toHaveBeenCalledTimes(1);
    });

    it('should handle NotFoundException', async () => {
      jest
        .spyOn(service, 'getPersonalityAnalysis')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.getAnalysis('999', mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle UnauthorizedException', async () => {
      jest
        .spyOn(service, 'getPersonalityAnalysis')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.getAnalysis('1', mockUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMBTIType', () => {
    it('should return MBTI type', async () => {
      const result = await controller.getMBTIType('1', mockUser as User);

      expect(result).toBe('ESTJ');
      expect(service.getMBTIType).toHaveBeenCalledWith('1', mockUser as User);
      expect(service.getMBTIType).toHaveBeenCalledTimes(1);
    });

    it('should handle NotFoundException', async () => {
      jest
        .spyOn(service, 'getMBTIType')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.getMBTIType('999', mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle UnauthorizedException', async () => {
      jest
        .spyOn(service, 'getMBTIType')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.getMBTIType('1', mockUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getCompatibility', () => {
    it('should return compatibility score', async () => {
      const result = await controller.getCompatibility(
        '1',
        '2',
        mockUser as User,
      );

      expect(result).toBe(85);
      expect(service.getCompatibilityScore).toHaveBeenCalledWith(
        '1',
        '2',
        mockUser as User,
      );
      expect(service.getCompatibilityScore).toHaveBeenCalledTimes(1);
    });

    it('should handle NotFoundException', async () => {
      jest
        .spyOn(service, 'getCompatibilityScore')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.getCompatibility('999', '2', mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle UnauthorizedException', async () => {
      jest
        .spyOn(service, 'getCompatibilityScore')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.getCompatibility('1', '2', mockUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle invalid compatibility requests', async () => {
      jest
        .spyOn(service, 'getCompatibilityScore')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.getCompatibility('1', '1', mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
