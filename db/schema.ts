import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const families = sqliteTable('families', { id: text('id').primaryKey(), tokenHash: text('token_hash').notNull().unique(), created: text('created').notNull() });
export const recipes = sqliteTable('recipes', { id: text('id').primaryKey(), family: text('family').notNull(), data: text('data').notNull(), updated: text('updated').notNull() });
export const meals = sqliteTable('meals', { id: text('id').primaryKey(), family: text('family').notNull(), day: text('day').notNull(), slot: text('slot').notNull(), recipe: text('recipe').notNull() });
