import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    avatar: 'avatar.jpg',
    googleId: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            validatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test.jwt.token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT token when credentials are valid', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(mockUser as User);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test.jwt.token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result.token).toBe('test.jwt.token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'nonexistent@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(mockUser as User);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@test.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user and return JWT token', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test.jwt.token');

      const result = await service.register({
        email: 'test@test.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(result.token).toBe('test.jwt.token');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
    });

    it('should throw ConflictException when email already exists', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(mockUser as User);

      await expect(
        service.register({
          email: 'test@test.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
