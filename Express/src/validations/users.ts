import Joi from 'joi';

const S = Joi.string();
const B = Joi.bool();
const N = Joi.number();
const A = Joi.array();

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
