export const DATABASE_CONFIG = {
    client: 'mysql',
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: 3306,
    password: process.env.DB_PASSWORD,
    database: 'testdb',
    stub: 'migration.stub',
    minpool: 1,
    maxpool: 1,
};
