import { Request, Response } from 'express';

import { CreateTask, UpdateTask } from '../validations/tasks';
import { Id } from '../validations/users';
import {
	createTask,
	deleteTaskById,
	findTaskById,
	findTasks,
	updateTaskById,
	assignTasks as assign,
} from '../db/tasksHandler';

export const getTasks = async (req: Request, res: Response) => {
	try {
		console.log('Fetching tasks');
		const tasks = await findTasks();
		if (tasks.length === 0) {
			res.sendStatus(404);
			return;
		}
		res.send(tasks);
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error fetching tasks, error: ${err}`);
	}
};

export const getTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params as Id;
		console.log(`Fetching task with id ${id}`);
		const task = await findTaskById(id);
		if (!task) {
			res.sendStatus(404);
			return;
		}
		res.send(task);
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error fetching task, error: ${err}`);
	}
};

export const postTask = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body as CreateTask;
		console.log(`Adding task`);
		await createTask({ name, description });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error adding task, error: ${err}`);
	}
};

export const updateTask = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body as UpdateTask;
		const { id } = req.params as Id;
		console.log(`Updating task with id ${id}`);
		await updateTaskById(id, {
			...(name && { name }),
			...(description && { description }),
		});
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error updating task, error: ${err}`);
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params as Id;
		console.log(`Deleting task with id ${id}`);
		await deleteTaskById(id);
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error deleting task, error: ${err}`);
	}
};

export const completeTask = async (req: Request, res: Response) => {
	try {
		const { id } = req.params as Id;
		console.log(`Completing task with id ${id}`);
		await updateTaskById(id, { completed: true, completedAt: new Date() });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error completing task, error: ${err}`);
	}
};

export const assignTasks = async (req: Request, res: Response) => {
	try {
		console.log(`Assign tasks`);
		await assign();
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error assigning tasks, error: ${err}`);
	}
};
