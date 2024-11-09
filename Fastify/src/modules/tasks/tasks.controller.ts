import { FastifyReply, FastifyRequest } from 'fastify';
import {
	CreateTaskInput,
	TaskIdParamInput,
	TaskUpdateInput,
} from './tasks.schemas';
// import { createTask, findTaskByEmail, findTasks } from './tasks.services';
import {
	assignTasks,
	createOne,
	deleteOne,
	find,
	findOne,
	updateOne,
} from '../../db/tasksHandler';

export async function postTaskHandler(
	request: FastifyRequest<{
		Body: CreateTaskInput;
	}>,
	reply: FastifyReply
) {
	const body = request.body;

	try {
		const task = await createOne(body);

		return reply.code(201).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function getTasksHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const tasks = await find({});

		return reply.code(200).send(tasks);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function getTaskHandler(
	request: FastifyRequest<{ Params: TaskIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const task = await findOne({ id });

		return reply.code(200).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function deleteTaskHandler(
	request: FastifyRequest<{ Params: TaskIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const task = await deleteOne({ id });

		return reply.code(200).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function updateTaskHandler(
	request: FastifyRequest<{ Params: TaskIdParamInput; Body: TaskUpdateInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const body = request.body;
		const task = await updateOne({ id }, body);

		return reply.code(200).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function completeTaskHandler(
	request: FastifyRequest<{ Params: TaskIdParamInput }>,
	reply: FastifyReply
) {
	try {
		const { id } = request.params;
		const task = await updateOne(
			{ id },
			{ completed: true, completiondate: new Date().toISOString() }
		);

		return reply.code(200).send(task);
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}

export async function assignTasksHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		await assignTasks();

		return reply.code(200).send('done');
	} catch (e) {
		console.log(e);
		return reply.code(500).send(e);
	}
}
