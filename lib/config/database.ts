import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PostgreSQL connection configuration
const dbConfig: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'jobit_database',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting to a new client
};

// Create connection pool
const pool = new Pool(dbConfig);

// Error handling for pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export database connection pool
export default pool;

// Helper function to execute queries with error handling
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release(); // Always release the client back to the pool
  }
};

// Function to test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};