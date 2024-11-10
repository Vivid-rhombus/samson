import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { fromError } from 'zod-validation-error';

type validationOptions = {
	params?: ZodSchema;
	body?: ZodSchema;
	query?: ZodSchema;
};

export default function (opts: validationOptions) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (opts.params) {
			try {
				opts.params.parse(req.params);
			} catch (err) {
				const validationError = fromError(err);
				res.status(400).send(validationError.message);
				return;
			}
		}
		if (opts.body) {
			try {
				opts.body.parse(req.body);
			} catch (err) {
				const validationError = fromError(err);
				res.status(400).send(validationError.message);
				return;
			}
		}
		if (opts.query) {
			try {
				opts.query.parse(req.query);
			} catch (err) {
				const validationError = fromError(err);
				res.status(400).send(validationError.message);
				return;
			}
		}
		next();
	};
}
