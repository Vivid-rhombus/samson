// src/index.ts
import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/health', (req: Request, res: Response) => {
	res.send('good');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
