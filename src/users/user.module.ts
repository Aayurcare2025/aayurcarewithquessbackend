  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { Login } from './login.entity';
import { DailyReportService } from './DailyReportService';
import { ScheduleModule } from '@nestjs/schedule';
import { DashModule } from 'src/Api/Dash.module';
import { DashService } from 'src/Api/DashApi.service';
import { Applicant } from 'src/Api/dash.entity';


@Module({
  imports:[TypeOrmModule.forFeature([User,Login,Applicant]),
DashModule ,

  ScheduleModule.forRoot(),
JwtModule.register({
      secret: 'secret', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService,DailyReportService,DashService],
  controllers:[UsersController],
  exports:[UserService,DailyReportService],
})
export class UsersModule {}
