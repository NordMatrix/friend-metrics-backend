import { ExecutionContext } from '@nestjs/common';
import { getCurrentUser } from './current-user.decorator';
import { User } from '../../users/entities/user.entity';

describe('getCurrentUser', () => {
  let mockExecutionContext: ExecutionContext;
  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(() => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should extract user from request', () => {
    const result = getCurrentUser(undefined, mockExecutionContext);
    expect(result).toEqual(mockUser);
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
  });

  it('should handle request without user', () => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as unknown as ExecutionContext;

    const result = getCurrentUser(undefined, mockExecutionContext);
    expect(result).toBeUndefined();
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
  });

  it('should handle invalid context', () => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(null),
      }),
    } as unknown as ExecutionContext;

    const result = getCurrentUser(undefined, mockExecutionContext);
    expect(result).toBeUndefined();
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
  });

  it('should handle different user data structures', () => {
    const customUser = {
      customId: '123',
      customEmail: 'custom@test.com',
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: customUser,
        }),
      }),
    } as unknown as ExecutionContext;

    const result = getCurrentUser(undefined, mockExecutionContext);
    expect(result).toEqual(customUser);
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
  });

  it('should handle null request', () => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(null),
      }),
    } as unknown as ExecutionContext;

    const result = getCurrentUser(undefined, mockExecutionContext);
    expect(result).toBeUndefined();
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
  });

  it('should handle null http context', () => {
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue(null),
    } as unknown as ExecutionContext;

    const result = getCurrentUser(undefined, mockExecutionContext);
    expect(result).toBeUndefined();
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
  });

  it('should ignore data parameter', () => {
    const data = { someData: 'test' };
    const result = getCurrentUser(data, mockExecutionContext);
    expect(result).toEqual(mockUser);
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
  });
}); 