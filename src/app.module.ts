import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CustomersModule } from './customers/customers.module.js';
import { ServicesModule } from './services/services.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { HealthModule } from './health/health.module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Conexión TypeORM → PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        database: config.get<string>('DB_NAME', 'fumicontrol'),
        username: config.get<string>('DB_USER', 'fumicontrol'),
        password: config.get<string>('DB_PASSWORD', 'fumicontrol_dev'),
        autoLoadEntities: true,
        entities: [join(__dirname, '/**/*.orm-entity.{ts,js}')],
        migrations: [join(__dirname, '/shared/infrastructure/database/migrations/*.{ts,js}')],
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
        migrationsRun: false,
      }),
    }),

    CustomersModule,
    ServicesModule,
    DashboardModule,
    HealthModule,
  ],
})
export class AppModule {}
