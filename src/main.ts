import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

const start: { (): void } = async () => {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
};

start();
