// src/index.ts
import express, { Express } from 'express';
import cors from 'cors';

import router from './routes';
import { connectDB } from './db/postgres/postgresHandler';

const app: Express = express();
const port = process.env.PORT || 3000;

const loadApp = async () => {
	await connectDB();
	app.use(express.json());
	app.use(cors());
	app.use(router);
};

loadApp();

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
