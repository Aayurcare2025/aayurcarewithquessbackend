  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import {  UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

import { JwtModule } from '@nestjs/jwt';


@Module({
  imports:[TypeOrmModule.forFeature([User]),
JwtModule.register({
      secret: 'secret', 
      signOptions: { expiresIn: '1h' },
    }),],
  providers: [UsersService],
  controllers:[UserController],
  exports:[UsersService],
})
export class UsersModule {}
