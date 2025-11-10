
// // import { TypeOrmModule } from '@nestjs/typeorm';
// // import { AuthModule } from './auth/auth.module';
// // import { typeOrmconfigAsync } from './typeorm.config';
// // import { AppController } from './app.controller';
// // import { AppService } from './app.service';
// // import { Module } from '@nestjs/common';
// // import { ConfigModule } from "@nestjs/config";
// // import { User } from './users/user.entity';
// // import { UsersModule } from './users/user.module';
// // import { Data1 } from './users/data.entity';
// // import { Opd } from './users/opd.entity';



// // @Module({
// //   imports: [
// //     ConfigModule.forRoot({
// //       isGlobal: true,
// //     }),
// //     AuthModule, UsersModule,
// //     TypeOrmModule.forRoot({
// //       type: 'mysql',
// //       host: 'localhost',
// //       port: 3306,
// //       username: 'root',
// //       password: 'Namb@0253',
// //       database: 'aayurcare',
// //       entities: [User,Data1,Opd],
// //       autoLoadEntities: true,
// //       synchronize: true
// //     }),
// //     // TypeOrmModule.forRootAsync(typeOrmconfigAsync)
// //   ],
// //   controllers: [AppController],
// //   providers: [AppService],
// // })
// // export class AppModule {}


// import { TypeOrmModule } from '@nestjs/typeorm';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from "@nestjs/config";
// import { MailController } from './mail/mail.controller';
// import { MailService } from './mail/mail.service';


// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,  // makes env vars available everywhere
//     }),
  

//     // ✅ Use ConfigService for DB settings
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         type: 'mysql',
//         host: config.get<string>('DB_HOST'),
//       port: parseInt(config.get<string>('DB_PORT') || '3306', 10),
//         username: config.get<string>('DB_USERNAME'),
//         password: config.get<string>('DB_PASSWORD'),
//         database: config.get<string>('DB_NAME'),
//         entities: [],
//         autoLoadEntities: true,
//         synchronize: true,
//       }),
//     }),
//   ],
//   controllers: [AppController,MailController],
//   providers: [AppService,MailService],
// })
// export class AppModule {}
// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// // import { MailController } from './mail/mail.controller';
// // import { MailService } from './mail/mail.service';

// @Module({
//   imports: [ConfigModule.forRoot({ isGlobal: true })],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}



// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
// import { typeOrmconfigAsync } from './typeorm.config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { Module } from '@nestjs/common';
// import { ConfigModule } from "@nestjs/config";
// import { User } from './users/user.entity';
// import { UsersModule } from './users/user.module';
// import { Data1 } from './users/data.entity';
// import { Opd } from './users/opd.entity';



// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     AuthModule, UsersModule,
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: 'Namb@0253',
//       database: 'aayurcare',
//       entities: [User,Data1,Opd],
//       autoLoadEntities: true,
//       synchronize: true
//     }),
//     // TypeOrmModule.forRootAsync(typeOrmconfigAsync)
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from './users/user.entity';
import { UsersModule } from './users/user.module';
import { ClaimsModule } from './claims/claim.module';
import { DashModule } from './Api/Dash.module';
import { PaymentModule } from './Payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // makes env vars available everywhere
    }),
    AuthModule, 
    UsersModule,
    ClaimsModule,
    DashModule,
    PaymentModule,
    

    // ✅ Use ConfigService for DB settings
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
      port: parseInt(config.get<string>('DB_PORT') || '3306', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

