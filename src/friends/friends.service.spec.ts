import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend.entity';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('FriendsService', () => {
  let service: FriendsService;
  let friendRepository: Repository<Friend>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        {
          provide: getRepositoryToken(Friend),
          useValue: {
            create: jest.fn().mockReturnValue(mockFriend),
            save: jest.fn().mockResolvedValue(mockFriend),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
    friendRepository = module.get<Repository<Friend>>(
      getRepositoryToken(Friend),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createFriendDto: CreateFriendDto = {
      name: 'Test Friend',
    };

    it('should create a friend', async () => {
      const result = await service.create(createFriendDto, mockUser);
      expect(result).toEqual(mockFriend);
      expect(friendRepository.create).toHaveBeenCalledWith({
        ...createFriendDto,
        user: mockUser,
      });
      expect(friendRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of friends', async () => {
      const friends = [mockFriend];
      jest.spyOn(friendRepository, 'find').mockResolvedValue(friends);

      const result = await service.findAll(mockUser);
      expect(result).toEqual(friends);
      expect(friendRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
    });
  });

  describe('findOne', () => {
    it('should return a friend', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(mockFriend);

      const result = await service.findOne('1', mockUser);
      expect(result).toEqual(mockFriend);
      expect(friendRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', user: { id: mockUser.id } },
      });
    });

    it('should throw NotFoundException when friend not found', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateFriendDto: UpdateFriendDto = {
      name: 'Updated Friend',
    };

    it('should update a friend', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(mockFriend);
      jest
        .spyOn(friendRepository, 'save')
        .mockResolvedValue({ ...mockFriend, ...updateFriendDto });

      const result = await service.update('1', updateFriendDto, mockUser);
      expect(result).toEqual({ ...mockFriend, ...updateFriendDto });
      expect(friendRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when friend not found', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update('1', updateFriendDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateScore', () => {
    const updateScoreDto: UpdateScoreDto = {
      scoreChange: 10,
    };

    it('should update friend score', async () => {
      const updatedFriend = {
        ...mockFriend,
        relationshipScore:
          mockFriend.relationshipScore + updateScoreDto.scoreChange,
      };
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(mockFriend);
      jest.spyOn(friendRepository, 'save').mockResolvedValue(updatedFriend);

      const result = await service.updateScore('1', updateScoreDto, mockUser);
      expect(result).toEqual(updatedFriend);
      expect(friendRepository.save).toHaveBeenCalledWith(updatedFriend);
    });

    it('should throw NotFoundException when friend not found', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateScore('1', updateScoreDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when score would go below 0', async () => {
      const friend = { ...mockFriend, relationshipScore: 5 };
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(friend);

      await expect(
        service.updateScore('1', { scoreChange: -10 }, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when score would exceed 100', async () => {
      const friend = { ...mockFriend, relationshipScore: 95 };
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(friend);

      await expect(
        service.updateScore('1', { scoreChange: 10 }, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a friend', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(mockFriend);
      jest
        .spyOn(friendRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      await service.remove('1', mockUser);
      expect(friendRepository.delete).toHaveBeenCalledWith({
        id: '1',
        user: { id: mockUser.id },
      });
    });

    it('should throw NotFoundException when friend not found', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
