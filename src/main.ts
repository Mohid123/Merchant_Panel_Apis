import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {cors: true});

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    // .setBasePath('api/v1/en')
    .setTitle('DiviDeals')
    .setDescription('DiviDeals APIs')
    .setVersion('1.0')
    .addTag('DiviDeals APIs')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = 5200;

  const server = await app.listen(port);
  server.setTimeout(60000);

  console.warn(`API is running on ${port}`);
}
bootstrap();
