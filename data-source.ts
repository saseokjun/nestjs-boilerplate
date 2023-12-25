import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(__dirname, `src/config/env/.${process.env.NODE_ENV}.env`),
});

const configService = new ConfigService();
const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres' as 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT') as string),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASS'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [__dirname + '/src/**/*.entity.ts'],
  synchronize: false,
  migrations: [__dirname + '/src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  seeds: [__dirname + '/src/config/seed.ts'],
};

export default new DataSource(dataSourceOptions);
