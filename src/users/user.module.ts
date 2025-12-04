  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { Login } from './login.entity';


import { DashModule } from 'src/Api/Dash.module';


@Module({
  imports:[TypeOrmModule.forFeature([User,Login]),
  DashModule,

JwtModule.register({
      secret: 'secret', 
      signOptions: { expiresIn: '1h' },
    }),],
  providers: [UserService,],
  controllers:[UsersController],
  exports:[UserService,],
})
export class UsersModule {}




