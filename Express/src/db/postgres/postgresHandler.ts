import { Client } from 'pg';

let client: Client;

export const connectDB = async () => {
	client = new Client('postgres://postgres:secret@localhost:5432/samson');
	await client.connect();
	await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL,
      createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

	// Create `tasks` table
	await client.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      user_id UUID,
      completed BOOLEAN DEFAULT FALSE,
      completionDate TIMESTAMPTZ,
      createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const getClient = () => {
	return client;
};
