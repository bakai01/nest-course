import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from "./app.module";

const start: { (): void } = async () => {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Мой первый nestJS сервер')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .addTag('sections')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
};

start();
