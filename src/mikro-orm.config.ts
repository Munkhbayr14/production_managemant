import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';
dotenv.config();
const databaseConfig: MikroOrmModuleOptions = {
    driver: PostgreSqlDriver,

    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_DATABASE,

    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],

    migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
    },

    debug: process.env.NODE_ENV !== 'production',
};

export default databaseConfig;