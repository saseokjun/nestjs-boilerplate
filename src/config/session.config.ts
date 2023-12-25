import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { Redis } from 'ioredis';
import * as passport from 'passport';
import config from './constant.config';

export function setupSession(app: INestApplication): void {
  const configService = app.get<ConfigService>(ConfigService);

  const port = parseInt(configService.get<string>('REDIS_PORT') as string);
  const host = configService.get<string>('REDIS_HOST');

  const client = new Redis({
    host,
    port,
    maxRetriesPerRequest: 1,
  });

  const redisStore = new RedisStore({
    client,
    ttl: 3,
  });

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      saveUninitialized: false,
      store: redisStore,
      cookie: {
        httpOnly: true,
        maxAge: config.sessionMaxAge,
        // sameSite: 'lax', // for ssl
        // secure: true, // for ssl
      },
      resave: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
}
