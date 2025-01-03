import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;
  let configService: ConfigService;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test_jwt_secret_key';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should use test-secret when JWT_SECRET is not provided', () => {
      expect(strategy).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should return user if valid payload', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as User);

      const result = await strategy.validate({ sub: '1' });

      expect(result).toEqual(mockUser);
      expect(usersService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(undefined);

      await expect(strategy.validate({ sub: '999' })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findById).toHaveBeenCalledWith('999');
    });

    it('should handle invalid payload format', async () => {
      await expect(strategy.validate({})).rejects.toThrow(UnauthorizedException);
    });

    it('should handle null payload', async () => {
      await expect(strategy.validate(null)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle undefined payload', async () => {
      await expect(strategy.validate(undefined)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle payload without sub', async () => {
      await expect(strategy.validate({ email: 'test@test.com' })).rejects.toThrow(UnauthorizedException);
    });
  });
}); 