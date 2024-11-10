import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres('postgres://postgres:secret@localhost:5432/samson');

export const db = drizzle();
