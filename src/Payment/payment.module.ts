  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PayuController } from './payment.controller';
import { PayuService } from './payment.service';
import { Payment } from './payment.entity';
import { Applicant } from 'src/Api/dash.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Payment,Applicant]),
],
  providers: [PayuService],
  controllers:[PayuController],
  exports:[PayuService],
})
export class PaymentModule {}
