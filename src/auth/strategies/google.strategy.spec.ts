import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from './google.strategy';
import { ConfigService } from '@nestjs/config';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'GOOGLE_CLIENT_ID':
                  return 'test-client-id';
                case 'GOOGLE_CLIENT_SECRET':
                  return 'test-client-secret';
                case 'GOOGLE_CALLBACK_URL':
                  return 'test-callback-url';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should use default values when environment variables are not provided', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      const newStrategy = new GoogleStrategy(configService);
      expect(newStrategy).toBeDefined();
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CLIENT_ID');
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CLIENT_SECRET');
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CALLBACK_URL');
    });

    it('should use provided environment variables', () => {
      const customConfig = {
        clientId: 'custom-client-id',
        clientSecret: 'custom-client-secret',
        callbackUrl: 'custom-callback-url',
      };

      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'GOOGLE_CLIENT_ID':
            return customConfig.clientId;
          case 'GOOGLE_CLIENT_SECRET':
            return customConfig.clientSecret;
          case 'GOOGLE_CALLBACK_URL':
            return customConfig.callbackUrl;
          default:
            return undefined;
        }
      });

      const newStrategy = new GoogleStrategy(configService);
      expect(newStrategy).toBeDefined();
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CLIENT_ID');
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CLIENT_SECRET');
      expect(configService.get).toHaveBeenCalledWith('GOOGLE_CALLBACK_URL');
    });
  });

  describe('validate', () => {
    const mockProfile = {
      id: 'google-id-123',
      name: {
        givenName: 'John',
        familyName: 'Doe',
      },
      emails: [{ value: 'john.doe@example.com' }],
      photos: [{ value: 'photo-url' }],
    };

    it('should return user data from profile', async () => {
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';
      const done = jest.fn();

      await strategy.validate(accessToken, refreshToken, mockProfile, done);

      expect(done).toHaveBeenCalledWith(null, {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'photo-url',
        googleId: 'google-id-123',
        accessToken: 'mock-access-token',
      });
    });

    it('should handle missing profile data', async () => {
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';
      const done = jest.fn();
      const incompleteProfile = {
        id: 'google-id-123',
      };

      await strategy.validate(
        accessToken,
        refreshToken,
        incompleteProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(null, {
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        avatar: undefined,
        googleId: 'google-id-123',
        accessToken: 'mock-access-token',
      });
    });

    it('should handle empty arrays in profile', async () => {
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';
      const done = jest.fn();
      const profileWithEmptyArrays = {
        id: 'google-id-123',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
        emails: [],
        photos: [],
      };

      await strategy.validate(
        accessToken,
        refreshToken,
        profileWithEmptyArrays,
        done,
      );

      expect(done).toHaveBeenCalledWith(null, {
        email: undefined,
        firstName: 'John',
        lastName: 'Doe',
        avatar: undefined,
        googleId: 'google-id-123',
        accessToken: 'mock-access-token',
      });
    });

    it('should handle null values in profile', async () => {
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';
      const done = jest.fn();
      const profileWithNulls = {
        id: 'google-id-123',
        name: null,
        emails: null,
        photos: null,
      };

      await strategy.validate(
        accessToken,
        refreshToken,
        profileWithNulls,
        done,
      );

      expect(done).toHaveBeenCalledWith(null, {
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        avatar: undefined,
        googleId: 'google-id-123',
        accessToken: 'mock-access-token',
      });
    });
  });
});
