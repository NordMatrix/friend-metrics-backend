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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockToken = 'mockJwtToken';

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
            sign: jest.fn().mockReturnValue(mockToken),
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

  describe('register', () => {
    const registerDto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as User);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException if user already exists', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@test.com',
      password: 'password',
    };

    it('should login successfully', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(usersService.validatePassword).toHaveBeenCalledWith(mockUser, loginDto.password);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(usersService.validatePassword).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(usersService.validatePassword).toHaveBeenCalledWith(mockUser, loginDto.password);
    });
  });

  describe('googleLogin', () => {
    const googleUser = {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      avatar: 'avatar.jpg',
    };

    it('should login existing google user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);

      const result = await service.googleLogin(googleUser);

      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith(googleUser.email);
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('should create and login new google user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as User);

      const result = await service.googleLogin(googleUser);

      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith(googleUser.email);
      expect(usersService.create).toHaveBeenCalledWith({
        ...googleUser,
        isGoogleAuth: true,
      });
    });
  });
}); 