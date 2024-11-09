import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			user: any;
		}
	}
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		res.sendStatus(401);
		return;
	}

	try {
		const decodedPayload: any = jwt.verify(token, 'secret');
		if (decodedPayload.data.role !== 'admin') {
			res.sendStatus(403);
			return;
		}
		req.user = decodedPayload;
		return next();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error decoding token, error: ${err}`);
	}
};
