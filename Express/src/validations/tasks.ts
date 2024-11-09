import Joi from 'joi';

export const taskSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
}).required();

export const updateTaskSchema = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
}).required();

export const taskIdSchema = Joi.object({
	id: Joi.string().required(),
}).required();
