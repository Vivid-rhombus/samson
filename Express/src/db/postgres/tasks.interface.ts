import { ObjectId } from 'mongodb';

export interface taskQueryInterface {
	id?: string;
	name?: string;
	completion?: boolean;
}

export interface taskInterface {
	id?: string;
	name?: string;
	description?: string;
	completion?: boolean;
	completionDate?: Date;
	updatedAt?: Date;
	createdAt?: Date;
}
