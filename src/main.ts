
  // import { NestFactory } from '@nestjs/core';
  // import { AppModule } from './app.module';
  // import * as bodyParser from 'body-parser'
  // async function bootstrap() {
  //     const app = await NestFactory.create(AppModule,{cors:true});
  // app.enableCors({
  //     origin:[
  //       'https://partner-quess.aayurcare.com'
  //     ],
  //     methods:['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
  //     credentials: true,
  //   });
  //   app.use(bodyParser.json({ limit: '50mb' }));
  //   app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  // await app.listen(6000, '0.0.0.0');
  
  // }

  // bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, { cors: true });

  // Allowed origins can be overridden via CORS_ORIGINS (comma-separated).
  // Defaults cover the production frontend and local development.
  const defaultOrigins = [
    'https://partner-quess.aayurcare.com',
    'http://localhost:3000',
  ];
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : defaultOrigins;

  app.enableCors({
    origin: corsOrigins, // frontend URL(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const port = Number(process.env.PORT) || 7000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);




}
 


bootstrap();



