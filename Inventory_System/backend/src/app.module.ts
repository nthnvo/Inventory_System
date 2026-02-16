// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    // ✅ โหลด .env เป็น Global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ✅ ต่อ DB ด้วยค่าจาก ENV แบบ Async
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = parseInt(config.get<string>('DB_PORT') ?? '3306', 10);
        const username = config.get<string>('DB_USER');
        const password = config.get<string>('DB_PASS');
        const database = config.get<string>('DB_NAME');

        // Log สั้น ๆ เวลาสตาร์ท (ช่วย Debug)
        // อย่าล็อก password จริง
        console.log('TYPEORM ENV', { host, port, username, database, hasPass: !!password });

        if (!host || !username || !database) {
          throw new Error('❌ Missing DB ENV. Please check .env (DB_HOST, DB_USER, DB_NAME, DB_PASS).');
        }

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          // ให้ TypeORM map entity อัตโนมัติจากแต่ละโมดูล
          autoLoadEntities: true,
          // เปิดเฉพาะช่วง Dev
          synchronize: true,
          // ช่วยดีบั๊ก
          logging: ['error', 'warn'],
        };
      },
    }),

    ProductsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
