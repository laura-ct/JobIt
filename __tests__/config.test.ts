import { describe, it, expect } from 'vitest';
import pool, { query } from '../lib/config/postgres';
import authConfig from '../lib/config/auth';

describe('Configuration Setup', () => {
  it('should have a valid PostgreSQL connection pool', () => {
    expect(pool).toBeDefined();
  });

  it('should have a query function', async () => {
    const result = await query('SELECT NOW()');
    expect(result).toBeDefined();
  });

  it('should have a valid better-auth configuration', () => {
    expect(authConfig).toBeDefined();
    expect(authConfig.secret).toBeTruthy();
  });
});