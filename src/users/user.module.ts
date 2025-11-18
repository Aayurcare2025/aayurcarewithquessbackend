  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UsersController } from './user.controller';


@Module({
  imports:[TypeOrmModule.forFeature([User]),
JwtModule.register({
      secret: 'secret', 
      signOptions: { expiresIn: '1h' },
    }),],
  providers: [UserService],
  controllers:[UsersController],
  exports:[UserService],
})
export class UsersModule {}
