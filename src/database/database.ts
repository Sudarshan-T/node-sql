import { DATABASE_CONFIG } from "../environment";

export const config = {
  client: DATABASE_CONFIG.client,
  connection: {
    host: DATABASE_CONFIG.host,
    port: DATABASE_CONFIG.port,
    user: DATABASE_CONFIG.user,
    password: DATABASE_CONFIG.password,
    database: DATABASE_CONFIG.database,
  },
  migrations: {
    stub: DATABASE_CONFIG.stub,
  },
  pool: {
    min: DATABASE_CONFIG.minpool,
    max: DATABASE_CONFIG.maxpool,
  },
};

export const timestamp = (): string => new Date().toUTCString();
