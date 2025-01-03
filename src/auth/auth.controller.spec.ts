import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

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

  const mockAuthResponse = {
    user: mockUser,
    token: 'mockJwtToken',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockAuthResponse),
            login: jest.fn().mockResolvedValue(mockAuthResponse),
            googleLogin: jest.fn().mockResolvedValue(mockAuthResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user', async () => {
      const result = await controller.register(registerDto);

      expect(result).toEqual(mockAuthResponse);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@test.com',
      password: 'password',
    };

    it('should login a user', async () => {
      const result = await controller.login(loginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('googleAuth', () => {
    it('should be defined', () => {
      expect(controller.googleAuth).toBeDefined();
    });
  });

  describe('googleAuthRedirect', () => {
    const mockRequest = {
      user: {
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'avatar.jpg',
      },
    };

    it('should handle google auth callback', async () => {
      const result = await controller.googleAuthRedirect(mockRequest);

      expect(result).toEqual(mockAuthResponse);
      expect(service.googleLogin).toHaveBeenCalledWith(mockRequest.user);
    });
  });
});
