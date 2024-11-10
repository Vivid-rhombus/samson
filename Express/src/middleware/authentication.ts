import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			user: any;
		}
	}
}

const payloadSchema = z
	.object({
		role: z.string(),
	})
	.passthrough();

type Payload = z.infer<typeof payloadSchema>;

type AuthPredicate = (payload: Payload) => boolean;

type AuthOptions = {
	predicate: AuthPredicate;
};

export default function auth(opts: AuthOptions) {
	return (req: Request, res: Response, next: NextFunction) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (token == null) {
			res.sendStatus(401);
			return;
		}

		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const decodedPayload = jwt.verify(token, 'secret');
			payloadSchema.parse(decodedPayload);
			if (!opts.predicate(decodedPayload as Payload)) {
				res.sendStatus(403);
				return;
			}
			req.user = decodedPayload;
			return next();
		} catch (err) {
			if (err instanceof ZodError) {
				res.sendStatus(403);
				return;
			}
			res.status(500);
			res.send(err);
			console.log(`Error decoding token, error: ${err}`);
		}
	};
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		res.sendStatus(401);
		return;
	}

	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
