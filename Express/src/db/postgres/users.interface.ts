import { ObjectId } from 'mongodb';

export interface userQueryInterface {
	id?: string;
	name?: string;
	role?: string;
}

export interface userInterface {
	id?: string;
	name?: string;
	role?: string;
	updatedAt?: Date;
	createdAt?: Date;
}
