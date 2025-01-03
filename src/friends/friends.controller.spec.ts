import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { User } from '../users/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Friend } from './entities/friend.entity';

describe('FriendsController', () => {
  let controller: FriendsController;
  let service: FriendsService;

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

  const mockFriendsService = {
    create: jest.fn().mockResolvedValue(mockFriend),
    findAll: jest.fn().mockResolvedValue([mockFriend]),
    findOne: jest.fn().mockResolvedValue(mockFriend),
    update: jest.fn().mockResolvedValue(mockFriend),
    remove: jest.fn().mockResolvedValue(undefined),
    updateScore: jest
      .fn()
      .mockResolvedValue({ ...mockFriend, relationshipScore: 5 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [
        {
          provide: FriendsService,
          useValue: mockFriendsService,
        },
      ],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
    service = module.get<FriendsService>(FriendsService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateFriendDto = {
      name: 'Test Friend',
      avatar: null,
      notes: '',
    };

    it('should create a friend', async () => {
      const result = await controller.create(createDto, mockUser as User);

      expect(result).toEqual(mockFriend);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser as User);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of friends', async () => {
      const result = await controller.findAll(mockUser as User);

      expect(result).toEqual([mockFriend]);
      expect(service.findAll).toHaveBeenCalledWith(mockUser as User);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a friend', async () => {
      const result = await controller.findOne('1', mockUser as User);

      expect(result).toEqual(mockFriend);
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
    const updateDto: UpdateFriendDto = {
      name: 'Updated Friend',
      notes: 'Updated notes',
    };

    it('should update a friend', async () => {
      const result = await controller.update('1', updateDto, mockUser as User);

      expect(result).toEqual(mockFriend);
      expect(service.update).toHaveBeenCalledWith(
        '1',
        updateDto,
        mockUser as User,
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto: UpdateFriendDto = { name: 'Updated Friend' };
      const expectedUpdate = { ...mockFriend, name: 'Updated Friend' };
      jest.spyOn(service, 'update').mockResolvedValue(expectedUpdate as Friend);

      const result = await controller.update(
        '1',
        partialUpdateDto,
        mockUser as User,
      );

      expect(result.name).toBe('Updated Friend');
      expect(result.notes).toBe(mockFriend.notes);
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
    it('should remove a friend', async () => {
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

  describe('updateScore', () => {
    const updateScoreDto = {
      scoreChange: 50,
    };

    it('should update friend score', async () => {
      const result = await controller.updateScore(
        '1',
        updateScoreDto,
        mockUser as User,
      );

      expect(result.relationshipScore).toBe(5);
      expect(service.updateScore).toHaveBeenCalledWith(
        '1',
        updateScoreDto,
        mockUser as User,
      );
      expect(service.updateScore).toHaveBeenCalledTimes(1);
    });

    it('should handle NotFoundException', async () => {
      jest
        .spyOn(service, 'updateScore')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateScore('999', updateScoreDto, mockUser as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle UnauthorizedException', async () => {
      jest
        .spyOn(service, 'updateScore')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.updateScore('1', updateScoreDto, mockUser as User),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should validate score range', async () => {
      const invalidScoreDto = {
        scoreChange: 150, // Score should be between -100 and 100
      };

      await expect(
        controller.updateScore('1', invalidScoreDto, mockUser as User),
      ).rejects.toThrow();
    });
  });
});
