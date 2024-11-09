export interface taskQueryInterface {
	id?: string;
	name?: string;
	completed?: boolean;
}

export interface taskInterface {
	id?: string;
	name?: string;
	description?: string;
	user_id?: string | null;
	completed?: boolean;
	completionDate?: Date;
	updatedAt?: Date;
	createdAt?: Date;
}
