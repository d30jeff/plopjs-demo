import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  CONSUMER_API_PORT: process.env.CONSUMER_API_PORT,
  CONSUMER_FRONTEND: process.env.CONSUMER_FRONTEND,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_READ_REPLICA_URL: process.env.DATABASE_READ_REPLICA_URL,
};
