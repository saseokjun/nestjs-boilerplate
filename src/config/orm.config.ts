import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const option = {
      type: 'postgres' as 'postgres',
      host: configService.get<string>('DATABASE_HOST'),
      port: parseInt(configService.get<string>('DATABASE_PORT') as string),
      username: configService.get<string>('DATABASE_USER'),
      password: configService.get<string>('DATABASE_PASS'),
      database: configService.get<string>('DATABASE_NAME'),
      entities: [join(__dirname, '../..', 'src/**/*.entity.{ts,js}')],
      synchronize: false,
      migrations: [join(__dirname, '../..', 'src/migrations/*.{ts,js}')],
      migrationsTableName: 'migrations',
    };
    return option;
  },
};
