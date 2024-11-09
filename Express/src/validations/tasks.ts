import Joi from 'joi';

const S = Joi.string();
const B = Joi.bool();
const N = Joi.number();
const A = Joi.array();

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
