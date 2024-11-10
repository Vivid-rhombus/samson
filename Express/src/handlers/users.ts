import { Request, Response } from 'express';

import {
	createUser,
	deleteUserById,
	findUserById,
	findUsers,
	updateUserById,
} from '../db/usersHandler';
import { CreateUser, Id, UpdateUser } from '../validations/users';

export const getUsers = async (req: Request, res: Response) => {
	try {
		console.log('Fetching users');
		const users = await findUsers();
		if (users.length === 0) {
			res.sendStatus(404);
			return;
		}
		res.send(users);
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error fetching users, error: ${err}`);
	}
};

export const getUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params as Id;
		console.log(`Fetching user with id ${id}`);
		const users = await findUserById(id);
		if (!users) {
			res.sendStatus(404);
			return;
		}
		res.send(users);
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error fetching user, error: ${err}`);
	}
};

export const postUser = async (req: Request, res: Response) => {
	try {
		const { name, role } = req.body as CreateUser;
		console.log(`Adding user`);
		await createUser({ name, role });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error adding user, error: ${err}`);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const { role } = req.body as UpdateUser;
		const { id } = req.params as Id;
		console.log(`Updating user with id ${id}`);
		await updateUserById(id, { role });
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error updating user, error: ${err}`);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params as Id;
		console.log(`Deleting user with id ${id}`);
		await deleteUserById(id);
		res.send();
	} catch (err) {
		res.status(500);
		res.send(err);
		console.log(`Error deleting user, error: ${err}`);
	}
};
