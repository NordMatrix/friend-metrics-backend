import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    avatar: 'avatar.jpg',
    googleId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findByEmail('test@test.com');

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should return undefined if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findByEmail('nonexistent@test.com');

      expect(result).toBeUndefined();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@test.com' },
      });
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findById('1');

      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return undefined if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findById('999');

      expect(result).toBeUndefined();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });

  describe('create', () => {
    const createUserData = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should create a new user with hashed password', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mockUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser as User);

      const result = await service.create(createUserData);

      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserData,
        password: 'hashedPassword',
      });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should create a user without hashing password for Google auth', async () => {
      const googleUserData = {
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        googleId: 'google123',
      };

      jest.spyOn(repository, 'create').mockReturnValue({ ...mockUser, googleId: 'google123' } as User);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockUser, googleId: 'google123' } as User);

      const result = await service.create(googleUserData);

      expect(result.googleId).toBe('google123');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(googleUserData);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const result = await service.validatePassword(mockUser as User, 'password');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    });

    it('should return false for invalid password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.validatePassword(mockUser as User, 'wrongpassword');

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    });
  });
}); 