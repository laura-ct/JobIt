import BetterAuth from 'better-auth';
import pool from '../config/database';

class AuthenticationService {
  private betterAuth: any;

  constructor() {
    this.betterAuth = new BetterAuth({
      database: {
        pool,
        usersTable: 'users',
        identityTable: 'user_identities'
      },
      security: {
        saltRounds: 10,
        tokenExpiration: '1h'
      }
    });
  }

  // User registration method
  async registerUser(email: string, password: string, additionalData?: Record<string, any>) {
    try {
      const user = await this.betterAuth.register({
        email,
        password,
        ...additionalData
      });
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // User login method
  async loginUser(email: string, password: string) {
    try {
      const loginResult = await this.betterAuth.login({
        email,
        password
      });
      return loginResult;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // JWT token verification
  async verifyToken(token: string) {
    try {
      const verification = await this.betterAuth.verifyToken(token);
      return verification;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }
}

export default new AuthenticationService();