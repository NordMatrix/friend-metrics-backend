import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    switch (key) {
      case 'JWT_SECRET':
        return 'test_jwt_secret_key';
      case 'JWT_EXPIRATION':
        return '1d';
      case 'GOOGLE_CLIENT_ID':
        return 'your_google_client_id';
      case 'GOOGLE_CLIENT_SECRET':
        return 'test_google_client_secret';
      case 'GOOGLE_CALLBACK_URL':
        return 'http://localhost:3000/auth/google/callback';
      default:
        return undefined;
    }
  }),
};

const mockUsersService = {
  findByEmail: jest.fn().mockResolvedValue(null),
  findById: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockImplementation((dto) => ({
    id: '1',
    ...dto,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  validatePassword: jest.fn().mockResolvedValue(true),
};

const mockRepository = {
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockImplementation((entity) => entity),
  create: jest.fn().mockImplementation((dto) => dto),
};

describe('AuthModule', () => {
  let module: any;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test'
        }),
        PassportModule,
        JwtModule.register({
          secret: 'test_jwt_secret_key',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        GoogleStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
      controllers: [AuthController],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AuthService', () => {
    const service = module.get(AuthService);
    expect(service).toBeDefined();
  });

  it('should have AuthController', () => {
    const controller = module.get(AuthController);
    expect(controller).toBeDefined();
  });

  it('should have JwtStrategy', () => {
    const strategy = module.get(JwtStrategy);
    expect(strategy).toBeDefined();
  });

  it('should have GoogleStrategy', () => {
    const strategy = module.get(GoogleStrategy);
    expect(strategy).toBeDefined();
  });

  it('should have UsersService', () => {
    const service = module.get(UsersService);
    expect(service).toBeDefined();
    expect(service.findByEmail).toBeDefined();
    expect(service.findById).toBeDefined();
    expect(service.create).toBeDefined();
    expect(service.validatePassword).toBeDefined();
  });

  it('should have ConfigService', () => {
    const service = module.get(ConfigService);
    expect(service).toBeDefined();
    expect(service.get('JWT_SECRET')).toBe('test_jwt_secret_key');
    expect(service.get('JWT_EXPIRATION')).toBe('1d');
  });
}); 