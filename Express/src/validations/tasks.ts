import Joi from 'joi';

const S = Joi.string();

export const taskSchema = Joi.object({
	name: S.required(),
	description: S.required(),
}).required();

export const updateTaskSchema = Joi.object({
	name: S.required(),
	description: S.required(),
}).required();

export const taskIdSchema = Joi.object({
	id: S.required(),
}).required();
