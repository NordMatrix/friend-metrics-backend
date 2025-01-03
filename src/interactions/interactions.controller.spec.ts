import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { User } from '../users/entities/user.entity';
import { Friend } from '../friends/entities/friend.entity';
import { Interaction } from './entities/interaction.entity';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { InteractionTypes } from './constants/interaction-types';
import { NotFoundException } from '@nestjs/common';

describe('InteractionsController', () => {
  let controller: InteractionsController;
  let service: InteractionsService;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password',
    avatar: 'avatar.jpg',
    googleId: 'google123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFriend: Partial<Friend> = {
    id: '1',
    name: 'Test Friend',
    relationshipScore: 0,
    user: mockUser as User,
    avatar: 'friend-avatar.jpg',
    notes: 'Test notes',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockInteraction = {
    id: '1',
    type: 'meeting',
    scoreChange: 5,
    friend: mockFriend,
    metadata: {},
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractionsController],
      providers: [
        {
          provide: InteractionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockInteraction),
            findAll: jest.fn().mockResolvedValue([mockInteraction]),
            findOne: jest.fn().mockResolvedValue(mockInteraction),
            remove: jest.fn().mockResolvedValue(undefined),
            getStatistics: jest.fn().mockResolvedValue({
              total: 1,
              byType: { [InteractionTypes.MEETING]: 1 },
              byMonth: { '2024-01': 1 },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<InteractionsController>(InteractionsController);
    service = module.get<InteractionsService>(InteractionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an interaction', async () => {
      const createDto: CreateInteractionDto = {
        type: InteractionTypes.MEETING,
        description: 'Test interaction',
        scoreChange: 1,
      };

      const result = await controller.create('1', createDto, mockUser as User);
      expect(result).toEqual(mockInteraction);
      expect(service.create).toHaveBeenCalledWith('1', createDto, mockUser);
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException());
      const createDto: CreateInteractionDto = {
        type: InteractionTypes.MEETING,
        description: 'Test interaction',
        scoreChange: 1,
      };

      await expect(controller.create('1', createDto, mockUser as User))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of interactions', async () => {
      const result = await controller.findAll('1', mockUser as User);
      expect(result).toEqual([mockInteraction]);
      expect(service.findAll).toHaveBeenCalledWith('1', mockUser);
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new NotFoundException());
      await expect(controller.findAll('1', mockUser as User))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single interaction', async () => {
      const result = await controller.findOne('1', '1', mockUser as User);
      expect(result).toEqual(mockInteraction);
      expect(service.findOne).toHaveBeenCalledWith('1', '1', mockUser);
    });

    it('should throw NotFoundException if interaction not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('1', '1', mockUser as User))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an interaction', async () => {
      await controller.remove('1', '1', mockUser as User);
      expect(service.remove).toHaveBeenCalledWith('1', '1', mockUser);
    });

    it('should throw NotFoundException if interaction not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
      await expect(controller.remove('1', '1', mockUser as User))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatistics', () => {
    it('should return interaction statistics', async () => {
      const result = await controller.getStatistics('1', mockUser as User);
      expect(result).toEqual({
        total: 1,
        byType: { [InteractionTypes.MEETING]: 1 },
        byMonth: { '2024-01': 1 },
      });
      expect(service.getStatistics).toHaveBeenCalledWith('1', mockUser);
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(service, 'getStatistics').mockRejectedValue(new NotFoundException());
      await expect(controller.getStatistics('1', mockUser as User))
        .rejects.toThrow(NotFoundException);
    });
  });
}); 