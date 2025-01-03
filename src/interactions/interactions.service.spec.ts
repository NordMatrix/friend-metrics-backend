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

describe('InteractionsService', () => {
  let service: InteractionsService;
  let interactionRepository: Repository<Interaction>;
  let friendsService: FriendsService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    avatar: null,
    isGoogleAuth: false,
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFriend: Friend = {
    id: '1',
    name: 'Test Friend',
    avatar: null,
    relationshipScore: 50,
    user: mockUser,
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    personality: null,
    interactions: [],
  };

  const mockInteraction: Interaction = {
    id: '1',
    type: InteractionTypes.CALL,
    scoreChange: 5,
    metadata: {},
    friend: mockFriend,
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
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: FriendsService,
          useValue: {
            findOne: jest.fn(),
            updateScore: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InteractionsService>(InteractionsService);
    interactionRepository = module.get<Repository<Interaction>>(
      getRepositoryToken(Interaction),
    );
    friendsService = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createInteractionDto: CreateInteractionDto = {
      type: InteractionTypes.CALL,
      scoreChange: 5,
      metadata: {},
    };

    it('should create an interaction', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(mockFriend);
      jest.spyOn(friendsService, 'updateScore').mockResolvedValue(mockFriend);

      const result = await service.create(
        mockFriend.id,
        createInteractionDto,
        mockUser,
      );
      expect(result).toEqual(mockInteraction);
      expect(interactionRepository.create).toHaveBeenCalledWith({
        ...createInteractionDto,
        friend: mockFriend,
      });
      expect(interactionRepository.save).toHaveBeenCalled();
      expect(friendsService.updateScore).toHaveBeenCalledWith(
        mockFriend.id,
        { scoreChange: createInteractionDto.scoreChange },
        mockUser,
      );
    });

    it('should throw NotFoundException when friend not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(null);

      await expect(
        service.create(mockFriend.id, createInteractionDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of interactions', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(mockFriend);
      jest
        .spyOn(interactionRepository, 'find')
        .mockResolvedValue([mockInteraction]);

      const result = await service.findAll(mockFriend.id, mockUser);
      expect(result).toEqual([mockInteraction]);
      expect(interactionRepository.find).toHaveBeenCalledWith({
        where: { friend: { id: mockFriend.id } },
        order: { createdAt: 'DESC' },
      });
    });

    it('should throw NotFoundException when friend not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(null);

      await expect(service.findAll(mockFriend.id, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return an interaction', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(mockFriend);
      jest
        .spyOn(interactionRepository, 'findOne')
        .mockResolvedValue(mockInteraction);

      const result = await service.findOne(mockFriend.id, '1', mockUser);
      expect(result).toEqual(mockInteraction);
      expect(interactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', friend: { id: mockFriend.id } },
      });
    });

    it('should throw NotFoundException when friend not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOne(mockFriend.id, '1', mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when interaction not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(mockFriend);
      jest.spyOn(interactionRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOne(mockFriend.id, '1', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an interaction', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(mockFriend);
      jest
        .spyOn(interactionRepository, 'findOne')
        .mockResolvedValue(mockInteraction);
      jest
        .spyOn(interactionRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      await service.remove(mockFriend.id, '1', mockUser);
      expect(interactionRepository.delete).toHaveBeenCalledWith({
        id: '1',
        friend: { id: mockFriend.id },
      });
    });

    it('should throw NotFoundException when friend not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(null);

      await expect(
        service.remove(mockFriend.id, '1', mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when interaction not found', async () => {
      jest.spyOn(friendsService, 'findOne').mockResolvedValue(mockFriend);
      jest.spyOn(interactionRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.remove(mockFriend.id, '1', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
