import { Test } from '@nestjs/testing';
import databaseConfig from './database.config';

describe('DatabaseConfig', () => {
  beforeEach(() => {
    // Set up test environment variables
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_USERNAME = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.DB_NAME = 'test_db';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    // Clean up test environment variables
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_USERNAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_NAME;
    delete process.env.NODE_ENV;
  });

  it('should return database configuration', () => {
    const config = databaseConfig();
    expect(config).toEqual({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test_user',
      password: 'test_password',
      database: 'test_db',
      entities: expect.any(Array),
      synchronize: true,
      logging: true,
    });
  });
}); 