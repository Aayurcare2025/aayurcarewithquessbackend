  import { BadRequestException, Injectable } from '@nestjs/common';


  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { Claims } from './claim.entity';


  @Injectable()
  export class ClaimsService {
      constructor(
          @InjectRepository(Claims)
          private readonly ClaimsRepository: Repository<Claims>, 
      ) {}


  async createData(payload: any): Promise<Claims> {
      const claim = this.ClaimsRepository.create({
        
        // id: payload.id,
        name: payload.name,
        phonenumber: payload.phonenumber,
        emailid: payload.emailid,
        servicetype: payload.servicetype,
        accountHolderName: payload.accountHolderName,
        bankAccountNumber: payload.bankAccountNumber,
        IFSCCode: payload.IFSCCode,
        BankName: payload.BankName,
        BankBranchName: payload.BankBranchName
      });


      return await this.ClaimsRepository.save(claim);
    }






  


  }

