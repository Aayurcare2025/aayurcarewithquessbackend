  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PayuController } from './payment.controller';
import { PayuService } from './payment.service.';

@Module({
  imports:[TypeOrmModule.forFeature([]),
],
  providers: [PayuService],
  controllers:[PayuController],
  exports:[PayuService],
})
export class PaymentModule {}
