  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DashController } from './DashApi.controller';
import { DashService } from './DashApi.service';
import { Applicant } from './dash.entity';
import { ScheduleModule } from '@nestjs/schedule';





@Module({
  imports:[TypeOrmModule.forFeature([Applicant]),
   ScheduleModule.forRoot(),
],
  providers: [DashService],
  controllers:[DashController],
  exports:[DashService],
})
export class DashModule {}


