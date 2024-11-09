// src/index.ts
import { Express } from 'express';
import { loadApp } from './server';

const startServer = async () => {
	const app: Express = await loadApp();
	const port = process.env.PORT || 3000;

	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
};

startServer();
