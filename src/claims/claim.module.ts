  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';


import { Claims } from './claim.entity';
import { ClaimsController } from './claim.controller';
import { ClaimsService } from './claim.service';



@Module({
  imports:[TypeOrmModule.forFeature([Claims]),
],
  providers: [ClaimsService],
  controllers:[ClaimsController],
  exports:[ClaimsService],
})
export class ClaimsModule {}
