import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend.entity';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('FriendsService', () => {
  let service: FriendsService;
  let friendRepository: Repository<Friend>;

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

  const mockFriend: Friend = {
    id: '1',
    name: 'Test Friend',
    user: mockUser as User,
    avatar: null,
    relationshipScore: 0,
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
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
    friendRepository = module.get<Repository<Friend>>(getRepositoryToken(Friend));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateFriendDto = {
      name: 'Test Friend',
      avatar: null,
      notes: '',
    };

    it('should create a friend', async () => {
      const result = await service.create(createDto, mockUser as User);

      expect(result).toEqual(mockFriend);
      expect(friendRepository.create).toHaveBeenCalledWith({
        ...createDto,
        user: mockUser,
      });
      expect(friendRepository.save).toHaveBeenCalledWith(mockFriend);
    });
  });

  describe('findAll', () => {
    it('should return an array of friends', async () => {
      const mockFriends = [mockFriend];
      jest.spyOn(friendRepository, 'find').mockResolvedValue(mockFriends);

      const result = await service.findAll(mockUser as User);

      expect(result).toEqual(mockFriends);
      expect(friendRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['personality'],
      });
    });

    it('should return empty array if no friends found', async () => {
      jest.spyOn(friendRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll(mockUser as User);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a friend', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(mockFriend);

      const result = await service.findOne('1', mockUser as User);

      expect(result).toEqual(mockFriend);
      expect(friendRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', user: { id: mockUser.id } },
        relations: ['personality'],
      });
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('999', mockUser as User)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user does not own the friend', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue({
        ...mockFriend,
        user: mockOtherUser as User,
      });

      await expect(service.findOne('1', mockUser as User)).rejects.toThrow(
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
      const updatedFriend = { ...mockFriend, ...updateDto };
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(mockFriend);
      jest.spyOn(friendRepository, 'save').mockResolvedValue(updatedFriend);

      const result = await service.update('1', updateDto, mockUser as User);

      expect(result).toEqual(updatedFriend);
      expect(friendRepository.save).toHaveBeenCalledWith(updatedFriend);
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('999', updateDto, mockUser as User)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user does not own the friend', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue({
        ...mockFriend,
        user: mockOtherUser as User,
      });

      await expect(service.update('1', updateDto, mockUser as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should update only specified fields', async () => {
      const partialUpdateDto: UpdateFriendDto = { name: 'Updated Friend' };
      const updatedFriend = { ...mockFriend, name: 'Updated Friend' };
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(mockFriend);
      jest.spyOn(friendRepository, 'save').mockResolvedValue(updatedFriend);

      const result = await service.update('1', partialUpdateDto, mockUser as User);

      expect(result.name).toBe('Updated Friend');
      expect(result.notes).toBe(mockFriend.notes);
    });
  });

  describe('remove', () => {
    it('should remove a friend', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(mockFriend);

      await service.remove('1', mockUser as User);

      expect(friendRepository.remove).toHaveBeenCalledWith(mockFriend);
    });

    it('should throw NotFoundException if friend not found', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('999', mockUser as User)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user does not own the friend', async () => {
      jest.spyOn(friendRepository, 'findOne').mockResolvedValue({
        ...mockFriend,
        user: mockOtherUser as User,
      });

      await expect(service.remove('1', mockUser as User)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('updateScore', () => {
    it('should update friend score', async () => {
      const updateScoreDto = { scoreChange: 50 };
      const friend = { ...mockFriend, relationshipScore: 30 };
      const expectedFriend = { ...friend, relationshipScore: 80 };

      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(friend);
      jest.spyOn(friendRepository, 'save').mockResolvedValue(expectedFriend);

      const result = await service.updateScore('1', updateScoreDto, mockUser as User);

      expect(result).toEqual(expectedFriend);
      expect(friendRepository.save).toHaveBeenCalledWith(expectedFriend);
    });

    it('should handle negative score change', async () => {
      const updateScoreDto = { scoreChange: -30 };
      const friend = { ...mockFriend, relationshipScore: 50 };
      const expectedFriend = { ...friend, relationshipScore: 20 };

      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(friend);
      jest.spyOn(friendRepository, 'save').mockResolvedValue(expectedFriend);

      const result = await service.updateScore('1', updateScoreDto, mockUser as User);

      expect(result).toEqual(expectedFriend);
      expect(friendRepository.save).toHaveBeenCalledWith(expectedFriend);
    });

    it('should not allow score to go below 0', async () => {
      const updateScoreDto = { scoreChange: -60 };
      const friend = { ...mockFriend, relationshipScore: 50 };
      const expectedFriend = { ...friend, relationshipScore: 0 };

      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(friend);
      jest.spyOn(friendRepository, 'save').mockResolvedValue(expectedFriend);

      const result = await service.updateScore('1', updateScoreDto, mockUser as User);

      expect(result).toEqual(expectedFriend);
      expect(friendRepository.save).toHaveBeenCalledWith(expectedFriend);
    });

    it('should not allow score to go above 100', async () => {
      const updateScoreDto = { scoreChange: 60 };
      const friend = { ...mockFriend, relationshipScore: 80 };
      const expectedFriend = { ...friend, relationshipScore: 100 };

      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(friend);
      jest.spyOn(friendRepository, 'save').mockResolvedValue(expectedFriend);

      const result = await service.updateScore('1', updateScoreDto, mockUser as User);

      expect(result).toEqual(expectedFriend);
      expect(friendRepository.save).toHaveBeenCalledWith(expectedFriend);
    });

    it('should validate score change range', async () => {
      const updateScoreDto = { scoreChange: 150 }; // Score change should be between -100 and 100
      const friend = { ...mockFriend, relationshipScore: 50 };

      jest.spyOn(friendRepository, 'findOne').mockResolvedValue(friend);

      await expect(service.updateScore('1', updateScoreDto, mockUser as User)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
}); 