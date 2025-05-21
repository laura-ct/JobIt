import BetterAuth, { 
  AuthConfig, 
  RegisterOptions, 
  LoginOptions, 
  AuthResult 
} from 'better-auth';
import pool from '../config/database';
import { testConnection } from '../config/database';

// Define custom error for authentication
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class AuthenticationService {
  private betterAuth: BetterAuth;

  constructor() {
    // Ensure database connection before initializing auth
    this.verifyDatabaseConnection();

    // Configuration for better-auth
    const authConfig: AuthConfig = {
      database: {
        pool,
        usersTable: 'users',
        identityTable: 'user_identities'
      },
      security: {
        saltRounds: 10,
        tokenExpiration: '1h',
        jwtSecret: process.env.JWT_SECRET || 'fallback_secret'
      },
      validation: {
        email: {
          required: true,
          minLength: 5,
          maxLength: 100
        },
        password: {
          required: true,
          minLength: 8,
          maxLength: 72 // Recommended max for bcrypt
        }
      }
    };

    this.betterAuth = new BetterAuth(authConfig);
  }

  // Verify database connection during initialization
  private async verifyDatabaseConnection() {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new AuthenticationError('Database connection failed');
    }
  }

  // User registration method with enhanced validation
  async registerUser(
    email: string, 
    password: string, 
    additionalData?: Record<string, any>
  ): Promise<AuthResult> {
    try {
      const registerOptions: RegisterOptions = {
        email,
        password,
        ...additionalData
      };

      return await this.betterAuth.register(registerOptions);
    } catch (error) {
      console.error('Registration error:', error);
      throw new AuthenticationError('User registration failed');
    }
  }

  // User login method with error handling
  async loginUser(
    email: string, 
    password: string
  ): Promise<AuthResult> {
    try {
      const loginOptions: LoginOptions = {
        email,
        password
      };

      return await this.betterAuth.login(loginOptions);
    } catch (error) {
      console.error('Login error:', error);
      throw new AuthenticationError('Invalid credentials');
    }
  }

  // JWT token verification
  async verifyToken(token: string): Promise<AuthResult> {
    try {
      return await this.betterAuth.verifyToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      throw new AuthenticationError('Invalid or expired token');
    }
  }
}

export default new AuthenticationService();