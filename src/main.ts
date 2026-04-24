import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filter/exception.filter';
import { ConfigService } from '@nestjs/config';
import { Env } from './config/env.schema';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpRef = app.getHttpAdapter().getHttpServer();
  const configService = app.get(ConfigService<Env>);

  const corsOrigins = configService.getOrThrow<string>('CORS_ORIGINS');
  const allowedOrigins: string[] = JSON.parse(corsOrigins);
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter(httpRef, new Logger()));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('/v1');

  const config = new DocumentBuilder()
    .setTitle('WebhookCenter API')
    .setDescription(
      'Reliable webhook delivery infrastructure — ingest, deliver, retry, and observe webhook events.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('documentation', app, document);

  app.use('/docs', apiReference({ url: '/documentation-json' }));

  app.use(helmet());

  await app.listen(configService.get('PORT'));
}
bootstrap();
