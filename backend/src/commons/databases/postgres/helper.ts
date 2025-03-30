import { timestamp } from "drizzle-orm/pg-core";

export const defaultTimestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
};

export const deletedTimestamps = {
  deleted_at: timestamp(),
};
