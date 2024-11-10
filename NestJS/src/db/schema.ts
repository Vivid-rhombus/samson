import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const UsersTable = pgTable('users', {
  id: uuid('user_id').primaryKey().defaultRandom().notNull(),
  name: text().notNull(),
  role: text({ enum: ['user', 'admin'] }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const TasksTable = pgTable('tasks', {
  id: uuid('task_id').primaryKey().defaultRandom().notNull(),
  name: text().notNull(),
  description: text().notNull(),
  completed: boolean().default(false).notNull(),
  userId: uuid('user_id').references(() => UsersTable.id),
  completedAt: timestamp('completed_at', { mode: 'date' }).defaultNow(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Relations

export const usersRelations = relations(UsersTable, ({ many }) => ({
  tasks: many(TasksTable),
}));

export const tasksRelations = relations(TasksTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [TasksTable.userId],
    references: [UsersTable['id']],
  }),
}));
