import Joi from 'joi';

export const userSchema = Joi.object({
	name: Joi.string().required(),
	role: Joi.string().required(),
}).required();

export const updateUserSchema = Joi.object({
	role: Joi.string().required().valid('admin', 'user'),
}).required();

export const userIdSchema = Joi.object({
	id: Joi.string().required(),
}).required();
