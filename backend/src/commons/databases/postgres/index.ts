import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { ENVS } from "../../configs/env";

export default function initPostgresql() {
  const connectionString = `postgresql://${ENVS.POSTGRES_USER}:${ENVS.POSTGRES_PASSWORD}@${ENVS.POSTGRES_HOST}:${ENVS.POSTGRES_PORT}/${ENVS.POSTGRES_DB}`;
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({ client });

  return { db, schema };
}
