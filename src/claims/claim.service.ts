  import { BadRequestException, Injectable } from '@nestjs/common';


  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { Claims } from './claim.entity';


//
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
        kycdocument: payload.kycdocument,
        consultationtype: payload.consultationtype,
        file_upload: payload.file_upload,
        accountHolderName: payload.accountHolderName,
        bankAccountNumber: payload.bankAccountNumber,
        reEnterAccountNumber: payload.reEnterAccountNumber,
        IFSCCode: payload.IFSCCode,
        BankName: payload.BankName,
        BankBranchName: payload.BankBranchName
      });


      return await this.ClaimsRepository.save(claim);
    }






  


  }

