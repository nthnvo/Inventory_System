// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ เปิด CORS
  app.enableCors({
    origin: 'http://localhost:5173', // URL ของ Frontend
    credentials: true,
  });
  
  // ✅ เปิด Validation
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
}));


  

  await app.listen(3000);
  console.log('🚀 Backend is running on http://localhost:3000');
}
bootstrap();