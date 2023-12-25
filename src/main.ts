import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'app.module';
import { setupSession } from 'config/session.config';
import { setupSwagger } from 'config/swagger.config';
import helmet from 'helmet';
import { readFileSync } from 'fs';

async function bootstrap() {
  const ssl = process.env.SSL === 'true' ? true : false;
  let httpsOptions = null;
  if (ssl) {
    httpsOptions = {
      key: readFileSync(process.env.SSL_KEY_PATH),
      cert: readFileSync(process.env.SSL_CERT_PATH),
    };
  }
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
  /*
  TODO: helmet
  const cspOptions = {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["self"],
      "img-src": ["self"],
      "base-url": ["/", "http:"]
    }
  }
  app.use(helmet({
    contentSecurityPolicy: cspOptions
  }));
  */
  setupSession(app);
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
