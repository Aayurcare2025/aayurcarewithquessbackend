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
  // Example: /dash/applicant?applicant_id=2003126588&contact_no=8628908673&first_name=Sandeep
  @Get('applicant')
  async getApplicant(
    @Query('applicant_id') applicant_id: string,
    @Query('contact_no') contact_no: string,
    @Query('first_name') first_name: string,
  ) {
    if (!applicant_id || !contact_no || !first_name) {
      return { error: 'applicant_id, contact_no, and first_name are required' };
    }

    const data = await this.dashService.getApplicantDataAndSave(applicant_id, contact_no, first_name);

    return {
      message: ' Data fetched and saved successfully',
      applicant_id,
      first_name,
      contact_no,
      data,
    };
  }
}
