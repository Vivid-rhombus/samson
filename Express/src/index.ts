// src/index.ts
import express, { Express } from 'express';

import router from './routes';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(router);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});