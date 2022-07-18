import { Module } from '@nestjs/common';
import * as path from "path";
import * as winston from 'winston';
import { AuthModule } from './Modules/auth.module';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from "./config/configuration";
import { configValidation } from "./config/configValidation";
import { ConnectionModule } from './DBConnection/Connection';
import { AdminModule } from './Modules/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin } from 'mongodb';
import { AdminSchema } from './Entity/admin.model';
import { UtilService } from './Utils/Utils';
import { IsRootInterceptor } from './Interceptors/isRoot.interceptor';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
       envFilePath: path.join(process.cwd(), "env", `.env.${process.env.NODE_ENV}`),
       isGlobal: true,
       load : [configuration],
       validationSchema : configValidation,
       cache : false
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
        winston.format.colorize({colors : {info: 'blue', error: 'red', debug : "yellow"}})
      ),
      transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
          dirname: path.join(__dirname, "logs"),
          filename: 'debug.log',
          level: 'debug',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, "logs"),
          filename: 'info.log',
          level: 'info',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, "logs"),
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
    ConnectionModule,
    AdminModule,
    ThrottlerModule.forRootAsync({
       imports:[ConfigModule],
       inject:[ConfigService],
       useFactory: ((config: ConfigService) =>{
             const options:ThrottlerModuleOptions = {
                 ttl: +config.get("TTL"),
                 limit: +config.get("RATE_LIMIT")
             }
             return options;
       })
    }),
    MongooseModule.forFeature([{name: Admin.name, schema:AdminSchema}])
  ],
  controllers: [AppController],
  providers: [AppService, UtilService, IsRootInterceptor],
})
export class AppModule {}
