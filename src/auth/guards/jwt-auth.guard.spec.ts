import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

jest.mock('@nestjs/passport', () => {
  class MockAuthGuard {
    canActivate() {
      return Promise.resolve(true);
    }
  }

  return {
    AuthGuard: jest.fn(() => MockAuthGuard),
  };
});

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with "jwt" strategy', () => {
    const { AuthGuard } = jest.requireMock('@nestjs/passport');
    expect(AuthGuard).toHaveBeenCalledWith('jwt');
  });

  it('should have canActivate method', () => {
    expect(guard.canActivate).toBeDefined();
    expect(typeof guard.canActivate).toBe('function');
  });

  it('should call parent canActivate method', async () => {
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });
}); 