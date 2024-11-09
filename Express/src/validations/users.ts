import Joi from 'joi';

const S = Joi.string();

export const userSchema = Joi.object({
	name: S.required(),
	role: S.required(),
}).required();

export const updateUserSchema = Joi.object({
	role: S.valid('admin', 'user'),
}).required();

export const userIdSchema = Joi.object({
	id: S.required(),
}).required();
