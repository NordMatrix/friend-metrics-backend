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
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-jwt-secret';
                default:
                  return null;
              }
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

  describe('validate', () => {
    it('should return user when token is valid', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as User);
      jest.spyOn(configService, 'get').mockReturnValue('test-jwt-secret');

      const result = await strategy.validate({ sub: '1' });

      expect(result).toEqual(mockUser);
      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(null);
      jest.spyOn(configService, 'get').mockReturnValue('test-jwt-secret');

      await expect(strategy.validate({ sub: '1' })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
