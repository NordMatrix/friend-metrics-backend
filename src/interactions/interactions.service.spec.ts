import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsService } from './interactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Interaction } from './entities/interaction.entity';
import { FriendsService } from '../friends/friends.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Friend } from '../friends/entities/friend.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { InteractionTypes } from './constants/interaction-types';
import { InteractionType } from './types/interaction.type';

describe('InteractionsService', () => {
  let service: InteractionsService;
  let interactionRepository: Repository<Interaction>;
  let friendsService: FriendsService;

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
      providers: [
        InteractionsService,
        {
          provide: getRepositoryToken(Interaction),
          useValue: {
            create: jest.fn().mockReturnValue(mockInteraction),
            save: jest.fn().mockResolvedValue(mockInteraction),
            find: jest.fn().mockResolvedValue([mockInteraction]),
            findOne: jest.fn().mockResolvedValue(mockInteraction),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: FriendsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockFriend),
            updateScore: jest.fn().mockResolvedValue(mockFriend),
          },
        },
      ],
    }).compile();

    service = module.get<InteractionsService>(InteractionsService);
    interactionRepository = module.get<Repository<Interaction>>(getRepositoryToken(Interaction));
    friendsService = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an interaction and update friend score', async () => {
      const createDto: CreateInteractionDto = {
        type: InteractionTypes.MEETING,
        scoreChange: 5,
        metadata: {},
      };

      jest.spyOn(friendsService, 'findOne').mockResolvedValue(mockFriend as Friend);
      jest.spyOn(interactionRepository, 'create').mockReturnValue(mockInteraction as Interaction);
      jest.spyOn(interactionRepository, 'save').mockResolvedValue(mockInteraction as Interaction);

      const result = await service.create('1', createDto, mockUser as User);
      expect(result).toEqual(mockInteraction);
      expect(friendsService.updateScore).toHaveBeenCalledWith('1', { scoreChange: 5 }, mockUser);
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockRejectedValue(new NotFoundException());
      const createDto: CreateInteractionDto = { 
        type: InteractionTypes.MEETING, 
        description: 'Test interaction',
        scoreChange: 1
      };
      await expect(service.create('1', createDto, mockUser as User)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of interactions', async () => {
      const result = await service.findAll('1', mockUser as User);
      expect(result).toEqual([mockInteraction]);
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.findAll('1', mockUser as User)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single interaction', async () => {
      const result = await service.findOne('1', '1', mockUser as User);
      expect(result).toEqual(mockInteraction);
    });

    it('should throw NotFoundException if interaction not found', async () => {
      jest.spyOn(interactionRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('1', '1', mockUser as User)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an interaction and update friend score', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockInteraction as Interaction);
      jest.spyOn(interactionRepository, 'remove').mockResolvedValue(mockInteraction as Interaction);

      await service.remove('1', '1', mockUser as User);
      expect(interactionRepository.remove).toHaveBeenCalledWith(mockInteraction);
      expect(friendsService.updateScore).toHaveBeenCalledWith('1', { scoreChange: -5 }, mockUser);
    });

    it('should throw NotFoundException if interaction not found', async () => {
      jest.spyOn(interactionRepository, 'findOne').mockResolvedValue(null);
      await expect(service.remove('1', '1', mockUser as User)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatistics', () => {
    it('should return interaction statistics', async () => {
      const result = await service.getStatistics('1', mockUser as User);
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('byType');
      expect(result).toHaveProperty('byMonth');
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.getStatistics('1', mockUser as User)).rejects.toThrow(NotFoundException);
    });
  });
}); 