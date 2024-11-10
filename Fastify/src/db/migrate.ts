import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(
	'postgres://postgres:secret@localhost:5432/samson',
	{ max: 1 }
);

async function main() {
	await migrate(drizzle(migrationClient), {
		migrationsFolder: './src/db/migrations',
	});

	await migrationClient.end();
}

main();
