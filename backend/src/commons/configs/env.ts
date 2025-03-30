import dotenv from "dotenv";
dotenv.config();

export const ENVS = {
  APP_ENV: process.env.APP_ENV ?? "development",
  APP_DOMAIN: process.env.APP_DOMAIN ?? "localhost:3001",
  APP_PORT: process.env.PORT ?? "3001",
  POSTGRES_USER: process.env.POSTGRES_USER ?? "",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? "",
  POSTGRES_HOST: process.env.POSTGRES_HOST ?? "",
  POSTGRES_PORT: process.env.POSTGRES_PORT ?? "",
  POSTGRES_DB: process.env.POSTGRES_DB ?? "",
};
