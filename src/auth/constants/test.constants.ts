/**
 * Test constants for authentication tests
 * These values are used only in tests and do not represent real credentials
 */
export const TEST_CONSTANTS = {
  JWT: {
    TOKEN: 'test.jwt.token',
    SECRET: 'test-jwt-secret',
  },
  GOOGLE: {
    CLIENT_ID: 'test-google-client-id',
    CLIENT_SECRET: 'test-google-client-secret',
  },
  USER: {
    ID: 'test-user-id',
    EMAIL: 'test@example.com',
    PASSWORD: 'test-password',
  },
} as const; 