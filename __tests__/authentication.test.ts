import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import AuthenticationService from '../lib/auth/authentication';
import pool from '../lib/config/database';

describe('Authentication Service', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'StrongPassword123!';

  beforeAll(async () => {
    // Setup test database or clean existing test user
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
  });

  afterAll(async () => {
    // Close database connection
    await pool.end();
  });

  it('should register a new user', async () => {
    const user = await AuthenticationService.registerUser(testEmail, testPassword);
    
    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
  });

  it('should login a registered user', async () => {
    const loginResult = await AuthenticationService.loginUser(testEmail, testPassword);
    
    expect(loginResult).toBeDefined();
    expect(loginResult.token).toBeTruthy();
  });

  it('should throw error for invalid login', async () => {
    await expect(
      AuthenticationService.loginUser(testEmail, 'wrongpassword')
    ).rejects.toThrow();
  });
});