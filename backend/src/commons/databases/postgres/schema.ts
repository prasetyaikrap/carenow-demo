import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { defaultTimestamps, deletedTimestamps } from "./helper";

// Tables
export const patientsTable = pgTable("patients", {
  id: uuid().primaryKey().defaultRandom(),
  patient_id: varchar({ length: 16 }).unique().notNull(),
  name: varchar({ length: 255 }).unique().notNull(),
  treatment_date: timestamp().notNull(),
  cost_of_treatment: integer().notNull(),
  ...defaultTimestamps,
  ...deletedTimestamps,
});

export const treatmentsTable = pgTable("treatments", {
  id: uuid().primaryKey().defaultRandom(),
  label: text().notNull(),
  ...defaultTimestamps,
  ...deletedTimestamps,
});

export const patientTreatmentTable = pgTable("patient_treatment", {
  id: uuid().primaryKey().defaultRandom(),
  patient_id: uuid()
    .references(() => patientsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  treatment_id: uuid()
    .references(() => treatmentsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const medicationsTable = pgTable("medications", {
  id: uuid().primaryKey().defaultRandom(),
  label: text().notNull(),
  ...defaultTimestamps,
  ...deletedTimestamps,
});

export const patientMedicationTable = pgTable("patient_medication", {
  id: uuid().primaryKey().defaultRandom(),
  patient_id: uuid()
    .references(() => patientsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  medication_id: uuid()
    .references(() => medicationsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
});
