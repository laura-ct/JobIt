import { describe, it, expect } from 'vitest';
import { AuthenticationService } from '../lib/auth/authentication';

describe('Authentication Service', () => {
  let authService: AuthenticationService;

  it('should create an instance of AuthenticationService', () => {
    authService = new AuthenticationService();
    expect(authService).toBeDefined();
    expect(authService).toBeInstanceOf(AuthenticationService);
  });

  it('should have betterAuth property', () => {
    expect(authService.betterAuth).toBeDefined();
  });

  it('should have required authentication methods', () => {
    expect(authService.registerUser).toBeDefined();
    expect(authService.loginUser).toBeDefined();
    expect(authService.verifyToken).toBeDefined();
  });
});