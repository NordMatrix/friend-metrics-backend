import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { User } from '../users/entities/user.entity';
import { Friend } from '../friends/entities/friend.entity';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { InteractionTypes } from './constants/interaction-types';
import { NotFoundException } from '@nestjs/common';

describe('InteractionsController', () => {
  let controller: InteractionsController;
  let service: InteractionsService;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractionsController],
      providers: [
        {
          provide: InteractionsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
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
    const createInteractionDto: CreateInteractionDto = {
      type: InteractionTypes.CALL,
      scoreChange: 5,
      metadata: {},
    };

    it('should create an interaction', async () => {
      const mockInteraction = {
        id: '1',
        type: InteractionTypes.CALL,
        scoreChange: 5,
        metadata: {},
        friend: mockFriend,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockInteraction);

      const result = await controller.create(
        mockFriend.id,
        createInteractionDto,
        mockUser,
      );
      expect(result).toEqual(mockInteraction);
      expect(service.create).toHaveBeenCalledWith(
        mockFriend.id,
        createInteractionDto,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of interactions', async () => {
      const mockInteractions = [
        {
          id: '1',
          type: InteractionTypes.CALL,
          scoreChange: 5,
          metadata: {},
          friend: mockFriend,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockInteractions);

      const result = await controller.findAll(mockFriend.id, mockUser);
      expect(result).toEqual(mockInteractions);
      expect(service.findAll).toHaveBeenCalledWith(mockFriend.id, mockUser);
    });
  });

  describe('findOne', () => {
    it('should return an interaction', async () => {
      const mockInteraction = {
        id: '1',
        type: InteractionTypes.CALL,
        scoreChange: 5,
        metadata: {},
        friend: mockFriend,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockInteraction);

      const result = await controller.findOne(mockFriend.id, '1', mockUser);
      expect(result).toEqual(mockInteraction);
      expect(service.findOne).toHaveBeenCalledWith(
        mockFriend.id,
        '1',
        mockUser,
      );
    });

    it('should throw NotFoundException when interaction not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(
        controller.findOne(mockFriend.id, '1', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an interaction', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(mockFriend.id, '1', mockUser);
      expect(service.remove).toHaveBeenCalledWith(mockFriend.id, '1', mockUser);
    });
  });
});
