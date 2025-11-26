  // async applyInsurance(insuranceDto: InsuranceDto): Promise<Insurance> {
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';


import { Claims } from './claim.entity';
import { ClaimsController } from './claim.controller';
import { ClaimsService } from './claim.service';
import { MailService } from './Mail.service';



@Module({
  imports:[TypeOrmModule.forFeature([Claims]),
],
  providers: [ClaimsService,MailService],
  controllers:[ClaimsController],
  exports:[ClaimsService,MailService],
})
export class ClaimsModule {}
