// import { Controller, Get, Query } from '@nestjs/common';
// import { DashService } from './DashApi.service';

// @Controller('dash')
// export class DashController {
//   constructor(private readonly dashService: DashService) {}

//   // Example route: GET /dash/applicant?applicantId=EMP123
//   @Get('applicant')
//   async getApplicant(@Query('applicantId') applicantId: string) {
//     if (!applicantId) {
//       return { error: 'applicantId is required' };
//     }

//     const data = await this.dashService.getApplicantData(applicantId);
//     return data;
//   }
// }




import { Controller, Get, Query } from '@nestjs/common';
import { DashService } from './DashApi.service';

@Controller('dash')
export class DashController {
  
  constructor(private readonly dashService: DashService) {}

  //
  //  Main API - GET /dash/applicant
  // Example: /dash/applicant?applicant_id=2003126588&contact_no=8628908673
  
  @Get('applicant')
  async getApplicant(
    @Query('applicant_id') applicant_id: string,
    // @Query('contact_no') contact_no: string,
   
  ) {
    if (!applicant_id ) {
      return { error: 'applicant_id is not required' };
    }
    //process not set in env:
    const data = await this.dashService.getApplicantDataAndSave(applicant_id);

    return {
      message: ' Data fetched and saved successfully',
      applicant_id,
      data,
    };
  }



  
  // @Get('applicant')
  // async getApplicantName(
  //   @Query('applicant_id') applicant_id: string,
  //   // @Query('contact_no') contact_no: string,
   
  // ) {
  //   if (!applicant_id ) {
  //     return { error: 'applicant_id is not required' };
  //   }
  //   //process not set in env:
  //   const data = await this.dashService.getApplicantNameAndSave(applicant_id);

  //   return {
  //     message: ' Data fetched and saved successfully',
  //     applicant_id,
  //     data,
  //   };
  // }
}
