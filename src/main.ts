
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import * as bodyParser from 'body-parser'
  async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
      const app = await NestFactory.create(AppModule,{cors:true});
  //  await app.listen(5000);
  app.enableCors({
      origin:[
        // 'http://localhost:3000',
        'https://partner-quess.aayurcare.com'
      ],
        // frontend domain
      methods:['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
      credentials: true,
    });



    //coverage:-

    

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(6000, '0.0.0.0');
  
  }

  bootstrap();
