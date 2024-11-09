import { FastifyReply, FastifyRequest } from 'fastify';
import {
	CreateUserInput,
	UserIdParamInput,
	UserUpdateInput,
} from './users.schemas';
import {
	createOne,
	deleteOne,
	find,
	findOne,
	updateOne,
} from '../../db/usersHandler';

export async function postUserHandler(
	request: FastifyRequest<{
		Body: CreateUserInput;
	}>,
	reply: FastifyReply
) {
	const body = request.body;

	try {
		const user = await createOne(body);

		return reply.code(201).send(user);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function getUsersHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		console.log('asdsd');
		const users = await find({});

		return reply.code(200).send(users);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function getUserHandler(
	request: FastifyRequest<{ Params: UserIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const user = await findOne({ id });

		return reply.code(200).send(user);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function deleteUserHandler(
	request: FastifyRequest<{ Params: UserIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const user = await deleteOne({ id });

		return reply.code(200).send(user);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function updateUserHandler(
	request: FastifyRequest<{ Params: UserIdParamInput; Body: UserUpdateInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const body = request.body;
		const user = await updateOne({ id }, body);

		return reply.code(200).send(user);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}
