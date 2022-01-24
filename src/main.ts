import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('DiviDeals')
    .setDescription('DiviDeals APIs')
    .setVersion('1.0')
    .addTag('DiviDeals')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = 5100;

  await app.listen(port);

  console.warn(`API is running on ${port}`)
}
bootstrap();
