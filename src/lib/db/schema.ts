import { pgTable, text, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const companies = pgTable('companies', {
  id: varchar('id').primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 256 }).notNull().unique(),
  address: text('address').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: varchar('id').primaryKey().$defaultFn(() => createId()),
  username: varchar('username', { length: 256 }).notNull().unique(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  mobile: varchar('mobile', { length: 50 }),
  companyId: varchar('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires'),
}, (table) => {
  return {
    emailIdx: uniqueIndex("email_idx").on(table.email),
    usernameIdx: uniqueIndex("username_idx").on(table.username),
  };
});
