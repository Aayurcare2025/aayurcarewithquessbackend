// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { Buffer } from 'buffer';

// @Injectable()
// export class DashService {
//   private readonly partnerName = 'aayurcare';
//   private readonly partnerKey = 'a0368ae2-f9af-48cd-b55d-136402ccddd0';
//   // private readonly apiUrl = 'https://api.dashbenefits.in/api/v1/submitLoanDetail';
//   //private readonly apiUrl = 'https://worq-marqet-api.heptagon.tech/api/v1/submitLoanDetail';
//   private readonly apiUrl = 'https://api.hamarabenefits.com/api/v1/submitLoanDetail';

//   async getApplicantData(applicantId: string) {
//     try {
    
//       const data = {
//         partner_name: this.partnerName,
//         applicant_id: applicantId,
//         date: new Date().toISOString().slice(0, 10), 
//         partner_key: this.partnerKey,
//       };

//       //
//     console.log("id",data.date)
//       const token = Buffer.from(JSON.stringify(data)).toString('base64');
//   console.log("token",token);
   
//       const body = {
//         token,
//         partner_name: this.partnerName,
//         partner_key: this.partnerKey,
//         applicant_id: applicantId,
//       };

    
//       const response = await axios.post(this.apiUrl, body);

     
//       return response.data;
//     } catch (error) {
//       console.error('Error calling Dash API:', error.response?.data || error.message);
//       throw new Error('Failed to fetch applicant data from Dash API');
//     }
//   }
// }



import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Buffer } from 'buffer';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Applicant } from './dash.entity';
import * as ExcelJS from 'exceljs';
import * as nodemailer from 'nodemailer';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class DashService {
  constructor(
  
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,
      private readonly configService: ConfigService,
  ) {}

//error handling if entering employee details is wrong:
//like contact no or first name or applicant isw wrong:

  private readonly partnerName = 'aayurcare';
  private readonly partnerKey = 'a0368ae2-f9af-48cd-b55d-136402ccddd0';
  private readonly apiUrl = 'https://api.hamarabenefits.com/api/v1/submitLoanDetail';

  /**
   * Fetch data from Dash API and save it in DB
   */

  //error handling if entering employee details is wrong:



  
  async getApplicantDataAndSave(applicant_id: string) {
    try {

      //ap
      //  Step 1: Prepare API body:--
      const data = {
        partner_name: this.partnerName,
        applicant_id,
        date: new Date().toISOString().slice(0, 10),
        partner_key: this.partnerKey,
      };

      const token = Buffer.from(JSON.stringify(data)).toString('base64');
      console.log("token",token);
      const body = { token, ...data };
      

      //  Step 2: Call external Dash API
      const response = await axios.post(this.apiUrl, body);
      const res = response.data.response;
      console.log("res",res);

      if (!res) throw new Error('Invalid response from Dash API');

      //  Step 3: Check if this record already exists
      const existing = await this.applicantRepo.findOne({
        where: { applicant_id: res.applicant_id },
      });

      


      
      //  Step 4: Create/Update data object:


      //data
      const applicant = {
        
        applicant_id: res.applicant_id,
        first_name: res.first_name, 
        last_name: res.last_name,
        contact_no: res.contact_no,
        // contact_no: res.contact_no || contact_no,
        email_id: res.email_id || '',
        DOB: res.DOB,
        gender: res.gender,
        Pincode: res.Pincode,
        City: res.City,
        State: res.State,
        customer_name: res.customer_name,
        DOJ: res.DOJ,
        employee_status: res.employee_status,
        designation: res.designation,
        work_location: res.work_location,
        company_name: res.employee_loan_status?.CompanyName,
        created_at: new Date()
      };

      //  Step 5: Save or update record
      if (existing) {
        await this.applicantRepo.update(existing.id, applicant);
        console.log(` Updated existing record: ${res.first_name} (${res.applicant_id})`);
      } else {
        await this.applicantRepo.save(applicant);
        console.log(` New record saved: ${res.first_name} (${res.applicant_id})`);
      }

      //Step 6: Return API response


      return response.data;
    } catch (error) {
      console.error(' Error fetching or saving applicant:', error.response?.data || error.message);
      throw new Error('Failed to fetch or save applicant data');
    }
  }


@Cron('0 0 12-23 * * *')

  async sendApplicantExcel() {
    try {
      console.log("⏳ Cron: Generating Applicant Excel Report (12 PM)");
 
      const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

const applicants = await this.applicantRepo.find({
  where: {
    created_at: Between(startOfToday, endOfToday)
  },
  select: ["first_name", "contact_no"]
});


      if (!applicants.length) {
        console.log("⚠ No applicant data found.");
        return;
      }


    
      // 2️⃣ Create Excel
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Applicants");

      sheet.columns = [
        { header: "First Name", key: "first_name", width: 30 },
        { header: "Contact Number", key: "contact_no", width: 20 },
      ];
     
      applicants.forEach(row => sheet.addRow(row));

     const excelBuffer=Buffer.from(await workbook.xlsx.writeBuffer()) ;
      // 3️⃣ Email sending
      const transporter = nodemailer.createTransport({
        host: this.configService.get("GODADDY_EMAIL_HOST"),
        port: Number(this.configService.get("GODADDY_EMAIL_PORT")),
        secure: true,
        auth: {
          user: this.configService.get("GODADDY_EMAIL_USER"),
          pass: this.configService.get("GODADDY_EMAIL_PASS"),
        },
      });

      await transporter.sendMail({
        from: this.configService.get("GODADDY_EMAIL_USER"),
        to:this.configService.get("GODADDY_PNO_EMAIL_USER_TO"),
        subject: "Daily Login Report",
        text: "Attached is the daily login daily report",
        attachments: [
          {
            filename: "Applicant_Report_12PM.xlsx",
           content:excelBuffer,
          },
        ],
      });
      
      console.log("📨 Email sent successfully!");

    } catch (error) {
      console.error(" Error in cron:", error);
    }
  }



  



  
  
}
